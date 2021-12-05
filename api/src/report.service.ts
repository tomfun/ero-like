import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
export { ReportForList, ReportBodyPayload } from './report.entity';
import {
  ReportEntity,
  ReportForList,
  ReportBodyPayload,
} from './report.entity';
import { validate } from 'class-validator';
import { Paginable, PaginationQueryDto } from './paginationQueryPipe';

export interface nick {
  nick: string
}

@Injectable()
export class ReportService {
  private reportRepo: Repository<ReportEntity>;
  constructor(connection: Connection) {
    this.reportRepo = connection.getRepository<ReportEntity>(ReportEntity);
  }

  async getList({
    page,
    pageSize,
  }: PaginationQueryDto): Promise<Paginable<ReportForList>> {
    const [items, itemsTotal] = await this.reportRepo.findAndCount({
      skip: page * pageSize,
      take: pageSize,
      order: { id: 1 },
    });
    return {
      items,
      itemsTotal,
      page,
      pageSize,
    };
  }

  async getListByNick({
    page,
    pageSize,
  }: PaginationQueryDto, nick: nick): Promise<Paginable<ReportForList>> {
    const [items, itemsTotal] = await this.reportRepo.findAndCount({
      skip: page * pageSize,
      take: pageSize,
      order: { id: 1 },
      where: {nick: nick}
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
