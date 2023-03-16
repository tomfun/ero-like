import { Inject, Injectable, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, Like, JsonContains, Repository, Raw } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { QueryOperator, ReportFilters, StringField } from './filtersQueryPipe';
import { Paginable, PaginationQueryDto } from './paginationQueryPipe';
import { ReportDataBodyPayload, ReportEntity } from './report.entity';
import { SignatureDataService } from './signature-data.service';
import { UserService } from './user.service';

export { ReportDataBodyPayload, ReportEntity } from './report.entity';

export type ReportForList = Omit<ReportEntity, 'user' | 'signature'>;
export type ReportBodyPayload = Omit<ReportEntity, 'user' | 'signature'>;

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
    const where = {} as FindOptionsWhere<ReportEntity>;
    // todo:
    // 1. https://typeorm.io/find-options
    // 2. https://typeorm.io/select-query-builder

    // if (filters.nick) {
    //   const nickFilter = this.buildStringWhere(filters.nick);
    //   if (nickFilter !== undefined) {
    //     where.nick = nickFilter;
    //   }
    // }
    if (filters.title || true) {
      const f = new StringField();
      f.filters = { start: 'Т' };
      const titleFilter = this.buildStringWhere(f);
      if (titleFilter !== undefined) {
        if (typeof titleFilter === 'string') {
          where.d = JsonContains({
            title: titleFilter,
          });
        } else {
          where.d = Raw((alias) => titleFilter.getSql(`${alias} ->> 'title'`));
        }
      }
      // getSql
      /*JsonContains({
        title: Like('asdf'),
      });*/
    }
    // const [items, itemsTotal] = await this.reportRepo.findAndCount({
    //   skip: page * pageSize,
    //   take: pageSize,
    //   order: { id: 1 },
    //   where,
    // });
    const query = this.reportRepo
      .createQueryBuilder('r')
      .where("r.d->>'title' LIKE :title", { title: 'Т%' });
    const [items, itemsTotal] = await query
      .skip(page * pageSize)
      .take(pageSize)
      .orderBy({ 'r.id': 'ASC' })
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
          user: true,
        },
      });
      if (report) {
        report.signature = signature;
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
    const user = await this.userService.fidUser(signature);
    report = new ReportEntity();
    report.d = createReportDto;
    report.signature = signature;
    report.user = user;
    await this.reportRepo.manager.save([
      report.signature.data,
      report.signature,
    ]);
    report.createdAt = report.signature.createdAt;
    return this.reportRepo.save(report);
  }

  private buildStringWhere(
    field: StringField,
  ): FindOperator<string> | string | undefined {
    if (QueryOperator.Equal in field.filters) {
      return field.filters[QueryOperator.Equal];
    }
    if (field.filters[QueryOperator.End]) {
      return Like(
        '%' +
          field.filters[QueryOperator.End]
            .replace(/%/g, '\\%')
            .replace(/_/g, '\\_'),
      );
    }
    if (field.filters[QueryOperator.Start]) {
      return Like(
        field.filters[QueryOperator.Start]
          .replace(/%/g, '\\%')
          .replace(/_/g, '\\_') + '%',
      );
    }
  }
}
