import { Injectable } from '@nestjs/common';
import { Connection, getRepository, Repository } from 'typeorm';
export { ReportForList, ReportBodyPayload } from './report.entity';
import { ReportEntity, ReportForList, ReportBodyPayload } from './report.entity';
import { validate } from 'class-validator';
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

  getList(): Paginable<ReportForList> {
    // return this.reportRepo.find();
    return {
      items: [
        {
          id: '3422b448-2460-4fd2-9183-8000de6f8343',
          gpgSignature: '',
          substances: [{ name: 'Xtc', activeSubstance: 'MDMA', sure: 90 }],
          nick: 'tomfun',
          title: 'Было весело',
        },
        {
          id: '3442b458-2660-4fd2-9173-8000de6f8343',
          gpgSignature: '',
          substances: [{ name: 'LSD', activeSubstance: 'LSD', sure: 95 }],
          nick: 'tomfun',
          title: 'Было не очень весело',
        },
        {
          id: '5424b448-2450-4fd2-9883-8000de6f8343',
          gpgSignature: '',
          substances: [{ name: 'Хмурый', activeSubstance: 'heroin', sure: 70 }],
          nick: 'tomfun',
          title: 'Теперь, я подсел',
        },
      ],
      itemsTotal: 3,
      page: 1,
      pageSize: 10,
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
    // todo: id?
    // https://www.npmjs.com/package/uuid
    await this.reportRepo.save(report);
    console.log(report);
    return report;
  }
}
