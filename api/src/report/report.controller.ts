import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import * as stringify from 'json-stable-stringify';
import { instanceToPlain } from 'class-transformer';
import { UUID_V4_REGEX } from '../consts';
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
  constructor(private readonly reportService: ReportService) {}

  @ApiResponse({
    description: `#### get single report
join parts to verify

\`\`\`js
\`-----BEGIN PGP SIGNED MESSAGE-----
Hash: $\{report.signature.hash}

$\{report.signature.data.clearSignDataPart}
$\{report.signature.block.blockArmored}
\`
\`\`\`

now you have php clear sign output to verify, if the result is saved to \`test-verify.txt\`

\`\`\`shell
gpg --verify test-verify.txt
\`\`\`

or with jq:
\`\`\`shell
curl -X 'GET' 'http://....../api/report/....' \\
  | jq -r '"-----BEGIN PGP SIGNED MESSAGE-----\\nHash: \\(.signature.hash[0])\\n\\n\\(.signature.data.clearSignDataPart)\\n\\(.signature.block.blockArmored)"' \\
  > test-verify.txt \\
  && gpg --verify test-verify.txt
\`\`\`
`,
  })
  @Get('/:id')
  async getReport(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Find by parameter id not provided');
    }
    if (!id.match(UUID_V4_REGEX)) {
      throw new BadRequestException(
        'Find by parameter id contain special characters',
      );
    }
    return instanceToPlain(await this.reportService.getReport(id), {
      groups: ['report', 'entity'],
    });
  }

  @Get()
  @ApiCreatedResponse({
    type: PaginableReportDto,
  })
  getReports(
    @PaginateQuery query: PaginationQueryDto,
    @PaginationFilters filters: ReportFilters,
  ): Promise<PaginableReportDto> {
    return this.reportService.getList(query, filters);
  }

  @Post('/validate')
  @ApiCreatedResponse({
    type: ReportDataBodyPayload,
  })
  @HttpCode(HttpStatus.OK)
  @Header('content-type', 'application/json; charset=utf-8')
  validateReport(
    @ValidBody
    createReportDto: ReportDataBodyPayload,
  ): ReportDataBodyPayload {
    return stringify(createReportDto);
  }

  @Patch()
  @ApiCreatedResponse({
    type: ReportEntity,
    status: HttpStatus.OK,
  })
  async postReport(@Body() data: string): Promise<ReportForList> {
    try {
      return instanceToPlain(await this.reportService.create(data), {
        groups: ['report', 'entity'],
      }) as ReportForList;
    } catch (e) {
      if (e instanceof InvalidDataError || e instanceof UserNotFoundError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }
}
