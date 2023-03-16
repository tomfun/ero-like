import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import {
  ReportService,
  ReportForList,
  ReportDataBodyPayload,
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

  @Post('/validate')
  validateReport(
    @ValidBody
    createReportDto: ReportDataBodyPayload,
  ): ReportDataBodyPayload {
    return createReportDto;
  }

  @Put()
  postReport(@Body() data: string): Promise<ReportForList> {
    return this.appService.create(data);
  }
}
