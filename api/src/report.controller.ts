import { Controller, Get, Post } from '@nestjs/common';
import {
  ReportService,
  ReportBodyPayload,
  ReportForList,
} from './report.service';
import {
  Paginable,
  PaginateQuery,
  PaginationQueryDto,
} from './paginationQueryPipe';
import { ValidBody } from './validBodyPipe';
import { PaginationFilters, ReportFilters } from './filtersQueryPipe';

@Controller('/api/report')
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get()
  getReports(
    @PaginateQuery query: PaginationQueryDto,
    @PaginationFilters filters: ReportFilters,
  ): Promise<Paginable<ReportForList>> {
    return this.appService.getList(query, filters);
  }

  @Post()
  postReport(
    @ValidBody
    createReportDto: ReportBodyPayload,
  ): Promise<ReportForList> {
    return this.appService.create(createReportDto);
  }
}
