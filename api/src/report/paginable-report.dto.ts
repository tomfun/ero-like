import { ApiProperty } from '@nestjs/swagger'
import { Paginable } from '../core/pagination-query.pipe'
import { ReportEntity } from '../entity'
import { ReportForList } from './report.service'

export class PaginableReportDto extends Paginable<ReportForList> {
  @ApiProperty({ type: [ReportEntity] }) // little hack: ReportEntity has sign
  declare items: ReportForList[]
}
