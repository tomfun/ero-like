import { PipeTransform, Query } from '@nestjs/common';

export type FieldFilters<Filters extends QueryOperator, T> = Partial<
  Record<Filters, T>
>;

export interface NumberFieldFilters
  extends FieldFilters<
    QueryOperator.GreaterThan | QueryOperator.LessThan | QueryOperator.Equal,
    number
  > {
  equals?: number;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
}

export interface StringFieldFilters
  extends FieldFilters<
    | QueryOperator.End
    | QueryOperator.Equal
    | QueryOperator.Contains
    | QueryOperator.Start,
    string
  > {
  equals?: string;
  include?: string;
  startsWith?: string; // validation?
  endsWith?: string;
}

export const TypeSymbol = Symbol('type');
export const FiltersSymbol = Symbol('filters');
export const KeyClassSymbol = Symbol('keyClass');

export interface StringField {
  filters: StringFieldFilters;
  [TypeSymbol]: typeof String;
  [KeyClassSymbol]?: 'jsonb_values_of_key';
}

export interface NumberField {
  filters: NumberFieldFilters;
  [TypeSymbol]: typeof Number;
}
/*
const FilterMatchMode = {
    STARTS_WITH : 'startsWith',
    CONTAINS : 'contains',
    NOT_CONTAINS : 'notContains',
    ENDS_WITH : 'endsWith',
    EQUALS : 'equals',
    NOT_EQUALS : 'notEquals',
    IN : 'in',
    LESS_THAN : 'lt',
    LESS_THAN_OR_EQUAL_TO : 'lte',
    GREATER_THAN : 'gt',
    GREATER_THAN_OR_EQUAL_TO : 'gte',
    BETWEEN : 'between',
    DATE_IS : 'dateIs',
    DATE_IS_NOT : 'dateIsNot',
    DATE_BEFORE : 'dateBefore',
    DATE_AFTER : 'dateAfter'
};
 */

/*
https://postgrest.org/en/stable/api.html#operators
 */

export enum QueryOperator {
  Equal = 'equals',
  Contains = 'contains',
  Start = 'startsWith',
  End = 'endsWith',
  GreaterThan = 'gt',
  GreaterThanEqual = 'gte',
  LessThan = 'lt',
  LessThanEqual = 'lte',
  Between = 'between',
}

export interface ReportDFilters
  extends ReportFilterType<typeof reportConfig.d> {
  // [TypeSymbol]: typeof Object;
  'substances.*.namePsychonautWikiOrg'?: StringField;
  dateTimestamp?: NumberField;
  title?: StringField;
}

export interface ReportFilters extends ReportFilterType<typeof reportConfig> {
  // [TypeSymbol]: typeof Object;

  nick?: StringField;

  d?: ReportDFilters;
}

const StringFilters = [
  QueryOperator.Start,
  QueryOperator.Equal,
  QueryOperator.End,
];
const HurtStringFilters = [...StringFilters, QueryOperator.Contains];

const NumberFilters = [
  QueryOperator.Equal,
  QueryOperator.GreaterThan,
  QueryOperator.GreaterThanEqual,
  QueryOperator.LessThan,
  QueryOperator.LessThanEqual,
];

interface ConfigSimple {
  [TypeSymbol]: typeof String | typeof Object | typeof Number;
  [FiltersSymbol]?: Array<QueryOperator>;
  [KeyClassSymbol]?: 'jsonb_values_of_key';
  [field: string]: ConfigSimple;
}

type ReportConfig<K extends string> = {
  [field in K]:
    | {
        [TypeSymbol]: typeof String;
        [FiltersSymbol]: Array<QueryOperator>;
        [KeyClassSymbol]?: 'jsonb_values_of_key';
      }
    | ({ [TypeSymbol]: typeof Object } & ReportConfig<string>);
};

type ReportFilterType<C extends ConfigSimple> = {
  [F in keyof C]?: C[F] extends { [TypeSymbol]: typeof String }
    ? StringField
    : C[F] extends { [TypeSymbol]: typeof Object }
    ? ReportFilterType<C[F]>
    : NumberField;
} & { [TypeSymbol]: typeof Object };

const reportConfig = {
  [TypeSymbol]: Object,
  nick: { [TypeSymbol]: String, [FiltersSymbol]: HurtStringFilters },
  d: {
    [TypeSymbol]: Object,
    title: { [TypeSymbol]: String, [FiltersSymbol]: HurtStringFilters },
    dateTimestamp: { [TypeSymbol]: Number, [FiltersSymbol]: NumberFilters },
    'substances.*.namePsychonautWikiOrg': {
      [TypeSymbol]: String,
      [FiltersSymbol]: HurtStringFilters,
      [KeyClassSymbol]: 'jsonb_values_of_key' as const,
    },
  },
};
export class FiltersQueryPipe implements PipeTransform {
  transform(query: Record<string, unknown>): ReportFilters {
    return this.deeper(query, reportConfig);
  }

  private deeper<C extends ConfigSimple>(
    queryUnk: unknown,
    config: C,
  ): ReportFilterType<C> {
    const filters = { [TypeSymbol]: Object } as unknown as ReportFilterType<C>;
    if (typeof queryUnk !== 'object') {
      return filters;
    }
    const query = queryUnk as Record<string, unknown>;
    Object.keys(config).forEach((fieldName) => {
      if (typeof query[fieldName] !== 'object' || !(fieldName in config)) {
        return;
      }
      const v = query[fieldName] as Record<string, unknown>;
      if (config[fieldName][TypeSymbol] === Object) {
        Object.assign(filters, {
          [fieldName]: this.deeper(v, config[fieldName]),
        });
        return;
      }
      if (![String, Number, Object].includes(config[fieldName][TypeSymbol])) {
        throw new TypeError('New query config type not implemented');
      }
      Object.assign(filters, {
        [fieldName]: {
          [TypeSymbol]: config[fieldName][TypeSymbol],
          [KeyClassSymbol]: config[fieldName][KeyClassSymbol],
          filters: {},
        },
      });
      for (const operator of config[fieldName][FiltersSymbol]) {
        if (operator in v && typeof v[operator] === 'string') {
          filters[fieldName].filters[operator] =
            config[fieldName][TypeSymbol] === String
              ? (v[operator] as string)
              : +v[operator];
        }
      }
    });
    return filters;
  }
}

export const PaginationFilters = Query(new FiltersQueryPipe());
