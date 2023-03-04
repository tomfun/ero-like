import { Injectable } from '@nestjs/common';
import { Connection, FindOperator, Like, Repository } from 'typeorm';
import {
  FindOptionsWhere,
} from 'typeorm/find-options/FindOptionsWhere';
import { QueryOperator, ReportFilters, StringField } from './filtersQueryPipe';
export {
  ReportForList,
  ReportBodyPayload,
  ReportEntity,
} from './report.entity';
import {
  ReportEntity,
  ReportForList,
  ReportBodyPayload,
} from './report.entity';
import { validate } from 'class-validator';
import { Paginable, PaginationQueryDto } from './paginationQueryPipe';

@Injectable()
export class ReportService {
  private reportRepo: Repository<ReportEntity>;
  constructor(connection: Connection) {
    this.reportRepo = connection.getRepository<ReportEntity>(ReportEntity);
  }

  async getList(
    { page, pageSize }: PaginationQueryDto,
    filters: ReportFilters,
  ): Promise<Paginable<ReportForList>> {
    const where = {} as FindOptionsWhere<ReportEntity>;
    if (filters.nick) {
      const nickFilter = this.buildStringWhere(
        filters.nick,
      );
      if (nickFilter !== undefined) {
        where.nick = nickFilter;
      }
    }
    if (filters.title) {
      const titleFilter = this.buildStringWhere(
        filters.title,
      );
      if (titleFilter !== undefined) {
        where.title = titleFilter;
      }
    }
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
