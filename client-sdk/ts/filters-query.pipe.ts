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
export type TypeSymbolType = typeof TypeSymbol;
export const FiltersSymbol = Symbol('filters');
export type FiltersSymbolType = typeof FiltersSymbol;
export const KeyClassSymbol = Symbol('keyClass');
export type KeyClassSymbolType = typeof KeyClassSymbol;

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

type ReportConfigType = {
  [TypeSymbol]: typeof Object;
  [field: string]:
    | {
        [TypeSymbol]: typeof String;
        [FiltersSymbol]: Array<QueryOperator>;
        [KeyClassSymbol]?: 'jsonb_values_of_key';
      }
    | {
        [TypeSymbol]: typeof Number;
        [FiltersSymbol]: Array<QueryOperator>;
      }
    | ReportConfigType;
};

export type ReportFilterType<C extends ReportConfigType> = {
  [F in keyof C]?: F extends typeof TypeSymbol
    ? C[F]
    : C[F] extends ReportConfigType
    ? ReportFilterType<C[F]>
    : C[F] extends { [TypeSymbol]: typeof String }
    ? StringField
    : NumberField;
} & { [TypeSymbol]: any };

export const StringFilters = [
  QueryOperator.Start,
  QueryOperator.Equal,
  QueryOperator.End,
];
export const HurtStringFilters = [...StringFilters, QueryOperator.Contains];

export const NumberFilters = [
  QueryOperator.Equal,
  QueryOperator.GreaterThan,
  QueryOperator.GreaterThanEqual,
  QueryOperator.LessThan,
  QueryOperator.LessThanEqual,
];

export class FiltersQueryPipe {
  protected deeper<C extends ReportConfigType>(
    queryUnk: unknown,
    config: C,
  ): ReportFilterType<C> {
    const filters = { [TypeSymbol]: Object } as unknown as ReportFilterType<C>;
    if (typeof queryUnk !== 'object') {
      return filters;
    }
    const query = queryUnk as Record<keyof C, unknown>;
    Object.keys(config).forEach((fieldNameString) => {
      if (
        typeof query[fieldNameString] !== 'object' ||
        !(fieldNameString in config)
      ) {
        return;
      }
      const fieldName = fieldNameString as keyof C;
      const v = query[fieldName] as Record<string, unknown>;
      const fieldConfig = config[fieldName];
      if (fieldConfig[TypeSymbol] === Object) {
        Object.assign(filters, {
          [fieldName]: this.deeper(v, fieldConfig as ReportConfigType),
        });
        return;
      }
      if (![String, Number, Object].includes(fieldConfig[TypeSymbol])) {
        throw new TypeError('New query config type not implemented');
      }
      Object.assign(filters, {
        [fieldName]:
          fieldConfig[TypeSymbol] === String
            ? {
                [TypeSymbol]: fieldConfig[TypeSymbol],
                [KeyClassSymbol]: fieldConfig[KeyClassSymbol],
                filters: {},
              }
            : {
                [TypeSymbol]: fieldConfig[TypeSymbol],
                filters: {},
              },
      });
      for (const operator of fieldConfig[FiltersSymbol]) {
        if (operator in v && typeof v[operator] === 'string') {
          filters[fieldName].filters[operator] =
            fieldConfig[TypeSymbol] === String
              ? (v[operator] as string)
              : +v[operator];
        }
      }
    });
    return filters;
  }
}
