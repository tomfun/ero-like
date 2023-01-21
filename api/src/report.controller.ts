import { Controller, Get, Post, Query, Req, Request } from '@nestjs/common';
import {
  ReportService,
  ReportBodyPayload,
  ReportForList,
  ReportEntity
} from './report.service';
import {
  Paginable,
  PaginateQuery,
  PaginationQueryDto,
} from './paginationQueryPipe';
import { ValidBody } from './validBodyPipe';
import { PaginationFilters, PaginationFilter } from './filtersQueryPipe';

@Controller() // maybe we can move '/api/report' here, or only '/api/
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get('/api/report?')
  getReports(
    @PaginateQuery query: PaginationQueryDto,
    @PaginationFilters filters: PaginationFilter<ReportEntity>,
  ): Promise<Paginable<ReportForList>> {
    return this.appService.getList(query, filters ? filters : {});
  }

  @Post('/api/report')
  postReport(
    @ValidBody
    createReportDto: ReportBodyPayload,
  ): Promise<ReportForList> {
    return this.appService.create(createReportDto);
  }
}
