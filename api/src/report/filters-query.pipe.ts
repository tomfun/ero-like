import { PipeTransform, Query } from '@nestjs/common'
import { reportConfig, ReportFilters } from 'ero-like-config'
import { lastParse as lastParseInner } from 'ero-like-sdk/dist/filters-query.pipe'

export {
  QueryOperator,
  NumberField,
  StringField,
  KeyClassSymbol,
  TypeSymbol,
} from 'ero-like-sdk/dist/filters-query.pipe'
export { ReportFilters } from 'ero-like-config'

export class FiltersQueryPipe implements PipeTransform {
  transform(query: Record<string, unknown>): ReportFilters {
    return lastParseInner(query, reportConfig)
  }
}

export const PaginationFilters = Query(new FiltersQueryPipe())
