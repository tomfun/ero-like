import { Controller, Get, Post, Query } from '@nestjs/common';
import {
  ReportService,
  ReportBodyPayload,
  ReportForList,
  ReportFIlters,
} from './report.service';
import {
  Paginable,
  PaginateQuery,
  PaginationQueryDto,
} from './paginationQueryPipe';
import { ValidBody } from './validBodyPipe';

@Controller()
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get('/api/report?')
  getReports(
    @PaginateQuery query: PaginationQueryDto,
    @Query('nick') nick: ReportFIlters,
  ): Promise<Paginable<ReportForList>> {
    if (nick) {
      return this.appService.getListByNick(query,nick);
    } else {
      return this.appService.getList(query)
    }  
  }

  @Post('/api/report')
  postReport(
    @ValidBody
    createReportDto: ReportBodyPayload,
  ): Promise<ReportForList> {
    return this.appService.create(createReportDto);
  }
}
