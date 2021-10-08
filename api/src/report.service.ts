import { Injectable } from '@nestjs/common';
import { Connection, getRepository, Repository } from 'typeorm';
export { ReportForList, ReportBodyPayload } from './report.entity';
import {
  ReportEntity,
  ReportForList,
  ReportBodyPayload,
} from './report.entity';
import { validate } from 'class-validator';
import { type } from 'os';
// import { Document } from './db/entity/Document';

export interface Paginable<Entity> {
  items: Entity[];
  page: number;
  pageSize: number;
  itemsTotal: number;
}

@Injectable()
export class ReportService {
  private reportRepo: Repository<ReportEntity>;
  constructor(connection: Connection) {
  this.reportRepo = connection.getRepository<ReportEntity>(ReportEntity);
}

  async getList(
    { skip, take },
  ): Promise<Paginable<ReportForList>> {
    const [items, itemsTotal] = await this.reportRepo.findAndCount({
      skip,
      take,
    });
    return {
      items,
      itemsTotal,
      page: skip / take,
      pageSize: take,
    };
  }

  async create(
    createReportDto: ReportBodyPayload
  ): Promise<ReportForList> {
    const report = new ReportEntity();
    Object.assign(report, createReportDto);
    const errors = await validate(report);
    if (errors.length > 0) {
      console.log(errors);
      throw new Error(`Validation failed!`);
    }
    await this.reportRepo.save(report);
    console.log(report);
    return report;
  }
}
