import { Inject, Injectable, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import {
  KeyClassSymbol,
  NumberField,
  QueryOperator,
  ReportFilters,
  StringField,
  TypeSymbol,
} from './filters-query.pipe';
import { Paginable, PaginationQueryDto } from '../core/pagination-query.pipe';
import { ReportDataBodyPayload, ReportEntity } from '../entity';
import { SignatureDataService } from '../core/signature-data.service';
import { UserService } from '../core/user.service';

export { ReportDataBodyPayload, ReportEntity } from '../entity';

export type ReportForList = Omit<ReportEntity, 'signature'>;

export const TYPE = 'drugs.ero-like.online/report@0.0.1-alpha-1';

@Injectable()
export class ReportService {
  @InjectRepository(ReportEntity)
  private reportRepo: Repository<ReportEntity>;

  @Inject()
  private signService: SignatureDataService;

  @Inject()
  private userService: UserService;

  readonly validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    validateCustomDecorators: true,
    // exceptionFactory: (e) => new TransformResourceDeserializationError(e),
  });

  async getList(
    { page, pageSize }: PaginationQueryDto,
    filters: ReportFilters,
  ): Promise<Paginable<ReportForList>> {
    let query = this.reportRepo
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.signature', 's')
      .select(['r', 's.id', 's.signedAt', 's.user']);
    if (filters?.signature?.user?.nick || filters?.signature?.user?.id) {
      const joins = [];
      const params = {};
      if (filters.signature.user.id) {
        const idWhere = this.buildStringWhere(
          filters.signature.user.id,
          'u.id',
          'userId',
        );
        if (idWhere) {
          joins.push(idWhere.sql);
          _.assign(params, idWhere.params);
        }
      }
      if (filters.signature.user.nick) {
        const nickWhere = this.buildStringWhere(
          filters.signature.user.nick,
          'u.nick',
          'userNick',
        );
        if (nickWhere) {
          joins.push(nickWhere.sql);
          _.assign(params, nickWhere.params);
        }
      }
      const joinWhere = joins.join(' AND ');
      query = query.innerJoinAndSelect('s.user', 'u', joinWhere, params);
    } else {
      query = query.innerJoinAndSelect('s.user', 'u');
    }
    let i = 0;
    for (const f in filters.d) {
      let key: string;
      if (filters.d[f][KeyClassSymbol] === 'jsonb_values_of_key') {
        // substances.*.namePsychonautWikiOrg
        //   ->
        // jsonb_values_of_key(r.d->'substances', 'namePsychonautWikiOrg')
        const fieldParts = f.split('.*.', 3);
        if (fieldParts.length !== 2) {
          throw new Error('jsonb_values_of_key class exception');
        }
        key = `jsonb_values_of_key(r.d->'${fieldParts[0]}', '${fieldParts[1]}')`;
      } else {
        key =
          filters.d[f][TypeSymbol] === String ? `r.d->>'${f}'` : `r.d->'${f}'`;
      }
      const subWhere =
        filters.d[f][TypeSymbol] === String
          ? this.buildStringWhere(
              filters.d[f],
              key,
              `d${f.replace(/\W/g, '')}${i++}`,
            )
          : this.buildNumberWhere(
              filters.d[f],
              `(${key})::numeric`,
              `d${f.replace(/\W/g, '')}${i++}`,
            );
      if (!subWhere) {
        continue;
      }
      query = query.andWhere(subWhere.sql, subWhere.params);
    }

    const [items, itemsTotal] = await query
      .skip(page * pageSize)
      .take(pageSize)
      .orderBy({ 'r.id': 'ASC' })
      .cache(60000)
      .getManyAndCount();
    return {
      items,
      itemsTotal,
      page,
      pageSize,
    };
  }

  async create(clearSignArmored: string): Promise<ReportForList> {
    const { signature } = await this.signService.createEntity({
      clearSignArmored,
      type: TYPE,
    });
    let report;
    if (signature.id) {
      report = await this.reportRepo.findOne({
        where: { signature: { id: signature.id } },
        relations: {
          signature: {
            user: true,
          },
        },
      });
      if (report) {
        return report;
      }
    }
    // throw http bad request error
    const createReportDto = await this.validationPipe.transform(
      JSON.parse(signature.data.clearSignDataPart),
      {
        type: 'body',
        metatype: ReportDataBodyPayload,
      },
    );
    report = new ReportEntity();
    report.d = createReportDto;
    report.signature = signature;
    await this.reportRepo.manager.save([
      report.signature.block,
      report.signature.data,
      report.signature,
    ]);
    report.createdAt = report.signature.createdAt;
    return this.reportRepo.save(report);
  }

  private buildStringWhere(
    field: StringField,
    key: string,
    pName: string,
  ): { sql: string; params: Record<string, string> } {
    if (QueryOperator.Equal in field.filters) {
      return {
        sql: `${key} = :${pName}`,
        params: { [pName]: field.filters[QueryOperator.Equal] },
      };
    }
    const params = {} as Record<string, string>;
    const sql = [] as string[];
    if (field.filters[QueryOperator.End]) {
      sql.push(`${key} LIKE :${pName}End`);
      params[`${pName}End`] =
        '%' +
        field.filters[QueryOperator.End]
          .replace(/%/g, '\\%')
          .replace(/_/g, '\\_');
    }
    if (field.filters[QueryOperator.Start]) {
      sql.push(`${key} LIKE :${pName}Start`);
      params[`${pName}Start`] =
        field.filters[QueryOperator.Start]
          .replace(/%/g, '\\%')
          .replace(/_/g, '\\_') + '%';
    }
    if (field.filters[QueryOperator.Contains]) {
      sql.push(`${key} LIKE :${pName}Include`);
      params[`${pName}Include`] =
        '%' +
        field.filters[QueryOperator.Contains]
          .replace(/%/g, '\\%')
          .replace(/_/g, '\\_') +
        '%';
    }
    if (sql.length) {
      return { sql: sql.join(' AND '), params };
    }
    return undefined;
  }

  private buildNumberWhere(
    field: NumberField,
    key: string,
    pName: string,
  ): { sql: string; params: Record<string, number> } {
    if (QueryOperator.Equal in field.filters) {
      return {
        sql: `${key} = :${pName}`,
        params: { [pName]: field.filters[QueryOperator.Equal] },
      };
    }
    const params = {} as Record<string, number>;
    const sql = [] as string[];
    if (field.filters[QueryOperator.GreaterThan]) {
      sql.push(`${key} > :${pName}Gt`);
      params[`${pName}Gt`] = field.filters[QueryOperator.GreaterThan];
    }
    if (field.filters[QueryOperator.GreaterThanEqual]) {
      sql.push(`${key} >= :${pName}Gte`);
      params[`${pName}Gte`] = field.filters[QueryOperator.GreaterThanEqual];
    }
    if (field.filters[QueryOperator.LessThan]) {
      sql.push(`${key} < :${pName}Lt`);
      params[`${pName}Lt`] = field.filters[QueryOperator.LessThan];
    }
    if (field.filters[QueryOperator.LessThanEqual]) {
      sql.push(`${key} <= :${pName}Lte`);
      params[`${pName}Lte`] = field.filters[QueryOperator.LessThanEqual];
    }
    if (field.filters[QueryOperator.Between]) {
      throw new Error('between not implemented');
    }
    if (sql.length) {
      return { sql: sql.join(' AND '), params };
    }
    return undefined;
  }
}
