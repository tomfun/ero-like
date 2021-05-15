import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportService, Paginable, ReportBodyPayload, ReportForList } from './report.service';

@Controller()
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get('/api/report')
  getReports(): Paginable<ReportForList> {
    return this.appService.getList();
  }

  @Post('/api/report')
  postReport(@Body() createReportDto: ReportBodyPayload): Promise<ReportForList> {
    return this.appService.create(createReportDto);
  }
}
