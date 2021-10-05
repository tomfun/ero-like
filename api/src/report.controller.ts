import { Body, Query, Controller, Get, Post } from '@nestjs/common';
import { query } from 'express';
import { ReportService, Paginable, ReportBodyPayload, ReportForList,} from './report.service';

export class PaginationQuery {
  page: number;
  pageSize: number;
}

@Controller()
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get('/api/report')
  getReports(@Query() query: PaginationQuery): Promise<Paginable<ReportForList>> {
    console.log(query, typeof query)
    return this.appService.getList({
      skip: query.page, 
      take: query.pageSize
    });
  }

  @Post('/api/report')
  postReport(@Body() createReportDto: ReportBodyPayload): Promise<ReportForList> {
    return this.appService.create(createReportDto);
  }
}
