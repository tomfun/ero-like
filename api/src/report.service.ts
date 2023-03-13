import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Connection, FindOperator, Like, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { QueryOperator, ReportFilters, StringField } from './filtersQueryPipe';
import { Paginable, PaginationQueryDto } from './paginationQueryPipe';
import { ReportDataBodyPayload, ReportEntity } from './report.entity';
import { UserEntity } from './user.entity';

export { ReportDataBodyPayload, ReportEntity } from './report.entity';

export type ReportForList = Omit<ReportEntity, 'user' | 'signature'>;
export type ReportBodyPayload = Omit<ReportEntity, 'user' | 'signature'>;

@Injectable()
export class ReportService {
  @InjectRepository(ReportEntity)
  private reportRepo: Repository<ReportEntity>;

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

  async create(createReportDto: ReportBodyPayload): Promise<ReportForList> {
    const report = new ReportEntity();
    Object.assign(report, createReportDto);
    const errors = await validate(report);
    if (errors.length > 0) {
      console.log(errors);
      throw new Error(`Validation failed!`);
    }
    await this.reportRepo.save(report);
    return report;
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
