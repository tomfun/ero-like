import { Query, PipeTransform } from '@nestjs/common';
import { IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StringFieldFilters {
  @IsString()
  @MaxLength(20)
  equal?: string;
  start?: string; // validation?
  end?: string;
}
export class StringField {
  @ValidateNested()
  @Type(() => StringFieldFilters)
  filters: StringFieldFilters;
  type: typeof String;
}

export enum QueryOperator {
  Equal = 'equal',
  Start = 'start',
  End = 'end',
}

export class ReportFilters {
  @ValidateNested()
  @Type(() => StringField)
  nick?: StringField;
  @ValidateNested()
  @Type(() => StringField)
  title?: StringField;
}

const StringFilters = [QueryOperator.Start, QueryOperator.Equal];

const reportConfig = {
  nick: { type: String, filters: StringFilters },
  title: { type: String, filters: StringFilters },
};

export class FiltersQueryPipe implements PipeTransform {
  transform(query: Record<string, unknown>): ReportFilters {
    const filters = new ReportFilters();
    if (typeof query !== 'object') {
      return filters;
    }
    (Object.keys(reportConfig) as [keyof typeof reportConfig])
      .filter(
        (fieldName) =>
          fieldName in query && typeof query[fieldName] === 'object',
      )
      .forEach((fieldName) => {
        if (typeof query[fieldName] !== 'object') {
          return;
        }
        const v = query[fieldName] as Record<string, unknown>;
        filters[fieldName] = {
          type: reportConfig[fieldName].type,
          filters: {},
        };
        for (const operator of reportConfig[fieldName].filters) {
          if (operator in v && typeof v[operator] === 'string') {
            filters[fieldName].filters[operator] = v[operator] as string;
          }
        }
      });
    return filters;
  }
}

export const PaginationFilters = Query(new FiltersQueryPipe());
