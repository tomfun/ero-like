import {
  PaginationQueryPipe,
  PaginationQueryDto as PaginationQueryInnerDto,
} from 'ero-like-sdk/dist/pagination-query.pipe';
import { ArgumentMetadata, Query, ValidationPipe } from '@nestjs/common';
import { IsIn, IsInt, Min } from 'class-validator';

export type { Paginable } from 'ero-like-sdk/dist/pagination-query.pipe';

export class PaginationQueryWrapperPipe extends ValidationPipe {
  pipe = new PaginationQueryPipe();
  async transform(
    query: any,
    metadata: ArgumentMetadata,
  ): Promise<PaginationQueryDto> {
    return super.transform(await this.pipe.transform(query), metadata);
  }
}

export class PaginationQueryDto extends PaginationQueryInnerDto {
  @IsInt()
  @Min(0)
  page = 0;
  @IsInt()
  @IsIn([10, 20, 50, 100])
  pageSize = 10;
}

export const PaginateQuery = Query(
  new PaginationQueryWrapperPipe({ whitelist: true, transform: true }),
);
