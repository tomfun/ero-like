import { ArgumentMetadata, Query, ValidationPipe } from '@nestjs/common';
import { IsInt } from 'class-validator';

export class PaginationQueryPipe extends ValidationPipe {
  transform(
    query: any,
    metadata: ArgumentMetadata,
  ): Promise<PaginationQueryDto> {
    const result = new PaginationQueryDto();
    if (query.page && query.page.match(/\d+/)) {
      result.page = +query.page;
    }
    if (query.pageSize && query.pageSize.match(/\d+/)) {
      result.pageSize = +query.pageSize;
    }
    return super.transform(result, metadata);
  }
}

export class PaginationQueryDto {
  @IsInt()
  page = 0;
  @IsInt()
  pageSize = 10;
}

export const PaginateQuery = Query(
  new PaginationQueryPipe({ whitelist: true, transform: true }),
);
