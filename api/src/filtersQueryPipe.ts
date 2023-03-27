import { PipeTransform, Query } from '@nestjs/common';
import { reportConfig, ReportFilters } from 'ero-like-config';
import { entities } from 'ero-like-sdk';
import { FiltersQueryPipe as FiltersQueryInnerPipe } from 'ero-like-sdk/dist/filters-query.pipe';

export {
  QueryOperator,
  NumberField,
  StringField,
  KeyClassSymbol,
  TypeSymbol,
} from 'ero-like-sdk/dist/filters-query.pipe';
export { ReportFilters } from 'ero-like-config';

console.log(entities);

export class FiltersQueryPipe
  extends FiltersQueryInnerPipe
  implements PipeTransform
{
  transform(query: Record<string, unknown>): ReportFilters {
    return this.deeper(query, reportConfig);
  }
}

export const PaginationFilters = Query(new FiltersQueryPipe());
