import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
export { ReportForList, ReportBodyPayload } from './report.entity';
import {
  ReportEntity,
  ReportForList,
  ReportBodyPayload,
} from './report.entity';
import { validate } from 'class-validator';
import { Paginable, PaginationQueryDto } from './paginationQueryPipe';

export interface ReportFilters {
  nick: string;
}

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
    const where = {} as FindConditions<ReportEntity>;
    if (filters.nick) {
      where.nick = filters.nick;
    }
    const [items, itemsTotal] = await this.reportRepo.findAndCount({
      skip: page * pageSize,
      take: pageSize,
      order: { id: 1 },
      where: where,
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
}
