import { parse, stringify } from 'qs';
import {
  lastParse as lastParseInner,
} from 'ero-like-sdk/dist/filters-query.pipe';
import { reportConfig } from 'ero-like-config';
import { LocationQuery } from 'vue-router';

export default class FiltersQueryPipe {
  static parse(query: string) {
    const q = parse(query);
    return lastParseInner<typeof reportConfig>(q, reportConfig);
  }

  static lastParse(query: LocationQuery) {
    return lastParseInner<typeof reportConfig>(query, reportConfig);
  }

  static stringify(toDo: string) {
    return stringify(toDo);
  }
}
