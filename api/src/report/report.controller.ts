import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { InvalidDataError } from '../core/gpg.service';
import { PaginableReportDto } from './paginable-report.dto';
import {
  ReportService,
  ReportForList,
  ReportDataBodyPayload,
  ReportEntity,
} from './report.service';
import {
  PaginateQuery,
  PaginationQueryDto,
} from '../core/pagination-query.pipe';
import { UserNotFoundError } from '../core/user.service';
import { ValidBody } from '../validBodyPipe';
import { PaginationFilters, ReportFilters } from './filters-query.pipe';

@Controller('/api/report')
export class ReportController {
  constructor(private readonly appService: ReportService) {}

  @Get()
  @ApiCreatedResponse({
    type: PaginableReportDto,
  })
  getReports(
    @PaginateQuery query: PaginationQueryDto,
    @PaginationFilters filters: ReportFilters,
  ): Promise<PaginableReportDto> {
    return this.appService.getList(query, filters);
  }

  @Post('/validate')
  @ApiCreatedResponse({
    type: ReportDataBodyPayload,
  })
  validateReport(
    @ValidBody
    createReportDto: ReportDataBodyPayload,
  ): ReportDataBodyPayload {
    return createReportDto;
  }

  @Put()
  @ApiCreatedResponse({
    type: ReportEntity,
  })
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
