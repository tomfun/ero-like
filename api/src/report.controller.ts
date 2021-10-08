import { Body, Query, Controller, Get, Post, ValidationPipe, } from '@nestjs/common';
import { ReportService, Paginable, ReportBodyPayload, ReportForList,} from './report.service';
import { PaginateQuery, PaginationQueryDto, PaginationQueryPipe } from './paginationQueryPipe';

@Controller()
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get('/api/report?')
  // getReports(@Query(new PaginationQueryPipe({ whitelist: true, transform: true})) query: PaginationQuery): Promise<Paginable<ReportForList>> { // turned off validation query: PaginationQuery !!checktype validation, query param = str but valid param IsInt
  getReports(@PaginateQuery query: PaginationQueryDto): Promise<Paginable<ReportForList>> { // turned off validation query: PaginationQuery !!checktype validation, query param = str but valid param IsInt
    return this.appService.getList({
      skip: query.page*query.pageSize,
      take: query.pageSize,
    });
  }

  @Post('/api/report')
  postReport(@Body(new ValidationPipe({ whitelist: true, transform: true})) createReportDto: ReportBodyPayload): Promise<ReportForList> {
    return this.appService.create(createReportDto);
  }
}
