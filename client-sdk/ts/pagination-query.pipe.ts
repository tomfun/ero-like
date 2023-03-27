export class PaginationQueryPipe {
  async transform(
    query: any,
  ): Promise<PaginationQueryDto> {
    const result = new PaginationQueryDto();
    if (query.page) {
      result.page = query.page.match(/\d+/) ? +query.page : null;
    }
    if (query.pageSize) {
      result.pageSize = query.pageSize.match(/\d+/) ? +query.pageSize : null;
    }
    return result;
  }
}

export class PaginationQueryDto {
  page = 0;
  pageSize = 2;
}

export interface Paginable<Entity> {
  items: Entity[];
  page: number;
  pageSize: number;
  itemsTotal: number;
}
