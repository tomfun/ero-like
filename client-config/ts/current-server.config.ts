import {
  HurtStringFilters,
  NumberField,
  NumberFilters,
  StringField,
  QueryOperator,
  ReportFilterType,
  TypeSymbol,
  FiltersSymbol,
  KeyClassSymbol,
} from 'ero-like-sdk/dist/filters-query.pipe'

export {
  QueryOperator,
  NumberField,
  StringField,
} from 'ero-like-sdk/dist/filters-query.pipe'

export interface ReportDFilters extends ReportFilterType<typeof reportConfig.d> {
  [TypeSymbol]: typeof Object
  'substances.*.namePsychonautWikiOrg'?: StringField
  dateTimestamp?: NumberField
  title?: StringField
}

export interface ReportFilters extends ReportFilterType<typeof reportConfig> {
  [TypeSymbol]: typeof Object

  signature?: {
    [TypeSymbol]: typeof Object
    user?: {
      [TypeSymbol]: typeof Object
      id?: StringField
      nick?: StringField
    }
  }

  d?: ReportDFilters
}

export const reportConfig = {
  [TypeSymbol]: Object,
  signature: {
    [TypeSymbol]: Object,
    user: {
      [TypeSymbol]: Object,
      id: { [TypeSymbol]: String, [FiltersSymbol]: [QueryOperator.Equal] },
      nick: { [TypeSymbol]: String, [FiltersSymbol]: HurtStringFilters },
    },
  },
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
}
