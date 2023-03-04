import { BadRequestException, Controller, Get, Post } from '@nestjs/common';
import { GpgService, ImportAndVerifyPayload, InvalidDataError } from './gpg.service';
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

@Controller('/api/user')
export class UserController {
  constructor(private readonly gpgService: GpgService) {}

  @Post()
  async postReport(
    @ValidBody
    importAndVerifyDto: ImportAndVerifyPayload,
  ) {
    try {
      return await this.gpgService.temporaryImportAndVerify(importAndVerifyDto);
    } catch (e) {
      if (e instanceof InvalidDataError) {
        throw new BadRequestException(e.message);
      }
    }
  }
}
