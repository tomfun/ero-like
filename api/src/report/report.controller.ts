import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { InvalidDataError } from '../core/gpg.service';
import {
  ReportService,
  ReportForList,
  ReportDataBodyPayload,
} from './report.service';
import {
  Paginable,
  PaginateQuery,
  PaginationQueryDto,
} from '../core/paginationQueryPipe';
import { UserNotFoundError } from '../core/user.service';
import { ValidBody } from '../validBodyPipe';
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
  async postReport(@Body() data: string): Promise<ReportForList> {
    try {
      return await this.appService.create(data);
    } catch (e) {
      if (e instanceof InvalidDataError || e instanceof UserNotFoundError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }
}
