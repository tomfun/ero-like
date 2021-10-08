import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
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

@Controller()
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get('/api/report?')
  getReports(
    @PaginateQuery query: PaginationQueryDto,
  ): Promise<Paginable<ReportForList>> {
    return this.appService.getList(query);
  }

  @Post('/api/report')
  postReport(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    createReportDto: ReportBodyPayload,
  ): Promise<ReportForList> {
    return this.appService.create(createReportDto);
  }
}
