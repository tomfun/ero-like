import { Body, Query, Controller, Get, Post,} from '@nestjs/common';
import { IsInt } from 'class-validator';
import { query } from 'express';
import { ReportService, Paginable, ReportBodyPayload, ReportForList,} from './report.service';

export class PaginationQuery {
  @IsInt()
  page: number = 0;
  @IsInt()
  pageSize: number = 10;
}

@Controller()
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get('/api/report?') // :page:pageSize ??
  getReports(@Query() query): Promise<Paginable<ReportForList>> { // turned off validation query: PaginationQuery !!checktype validation, query param = str but valid param IsInt
    console.log(query)
    console.log(query.page)
    console.log(query.pageSize)
    return this.appService.getList({
      skip: query.page, 
      take: query.pageSize,
      pageSize: query.pageSize,
    });
  }

  @Post('/api/report')
  postReport(@Body() createReportDto: ReportBodyPayload): Promise<ReportForList> {
    return this.appService.create(createReportDto);
  }
}
