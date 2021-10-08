import { ArgumentMetadata, Query, ValidationPipe } from '@nestjs/common';
import { IsIn, IsInt, Min } from 'class-validator';

export class PaginationQueryPipe extends ValidationPipe {
  transform(
    query: any,
    metadata: ArgumentMetadata,
  ): Promise<PaginationQueryDto> {
    const result = new PaginationQueryDto();
    if (query.page) {
      result.page = query.page.match(/\d+/) ? +query.page : null;
    }
    if (query.pageSize) {
      result.pageSize = query.pageSize.match(/\d+/) ? +query.pageSize : null;
    }
    return super.transform(result, metadata);
  }
}

export class PaginationQueryDto {
  @IsInt()
  @Min(0)
  page = 0;
  @IsInt()
  @IsIn([10, 20, 50, 100])
  pageSize = 10;
}

export const PaginateQuery = Query(
  new PaginationQueryPipe({ whitelist: true, transform: true }),
);

export interface Paginable<Entity> {
  items: Entity[];
  page: number;
  pageSize: number;
  itemsTotal: number;
}
