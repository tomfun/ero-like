import { ArgumentMetadata, Query, ValidationPipe } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, Min } from 'class-validator';
import {
  Paginable as PaginableInner,
  PaginationQueryDto as PaginationQueryInnerDto,
  PaginationQueryPipe,
} from 'ero-like-sdk/dist/pagination-query.pipe';

export class Paginable<Entity> extends PaginableInner<Entity> {
  @ApiProperty()
  declare page: number;

  @ApiProperty()
  declare pageSize: number;

  @ApiProperty()
  declare itemsTotal: number;
}

export class PaginationQueryWrapperPipe extends ValidationPipe {
  pipe = new PaginationQueryPipe();
  async transform(
    query: any,
    metadata: ArgumentMetadata,
  ): Promise<PaginationQueryDto> {
    if (
      metadata.metatype !== PaginationQueryDto &&
      !(metadata.metatype.prototype instanceof PaginationQueryDto)
    ) {
      throw new Error('Invalid pagination subclass');
    }
    return super.transform(await this.pipe.transform(query), metadata);
  }
}

export class PaginationQueryDto extends PaginationQueryInnerDto {
  @IsInt()
  @Min(0)
  declare page;
  @IsInt()
  @IsIn([10, 20, 50, 100])
  declare pageSize;
}

export const PaginateQuery = Query(
  new PaginationQueryWrapperPipe({ whitelist: true, transform: true }),
);
