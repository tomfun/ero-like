import { Inject, Injectable, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, Like, Repository } from 'typeorm';
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
    // if (filters.title) {
    //   const titleFilter = this.buildStringWhere(filters.title);
    //   if (titleFilter !== undefined) {
    //     where.title = titleFilter;
    //   }
    // }
    const [items, itemsTotal] = await this.reportRepo.findAndCount({
      skip: page * pageSize,
      take: pageSize,
      order: { id: 1 },
      where,
    });
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
    // throw http bad request error
    const createReportDto = await this.validationPipe.transform(
      JSON.parse(signature.data.clearSignDataPart),
      {
        type: 'body',
        metatype: ReportDataBodyPayload,
      },
    );
    const report = new ReportEntity();
    report.d = createReportDto;
    report.signature = signature;
    report.user = await this.userService.fidUser(signature);
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
