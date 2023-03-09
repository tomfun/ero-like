import { BadRequestException, Controller, Post } from '@nestjs/common';
import { ImportAndVerifyPayload, InvalidDataError } from './gpg.service';
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
import {
  NotAcceptAgreementError,
  UserCreateError,
  UserService,
} from './user.service';
import { ValidBody } from './validBodyPipe';
import { PaginationFilters, ReportFilters } from './filtersQueryPipe';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/dry-run')
  async postReportDryRun(
    @ValidBody
    importAndVerifyDto: ImportAndVerifyPayload,
  ) {
    try {
      const data = await this.userService.createUserDryRun(importAndVerifyDto);
      return data.user;
    } catch (e) {
      this.convertUserRegisterError(e);
      throw e;
    }
  }

  @Post()
  async postReport(
    @ValidBody
    importAndVerifyDto: ImportAndVerifyPayload,
  ) {
    try {
      return await this.userService.createUser(importAndVerifyDto);
    } catch (e) {
      this.convertUserRegisterError(e);
    }
  }
  private convertUserRegisterError(e: Error): never {
    if (
      e instanceof InvalidDataError ||
      e instanceof NotAcceptAgreementError ||
      e instanceof UserCreateError
    ) {
      throw new BadRequestException(e.message);
    }
    throw e;
  }
}
