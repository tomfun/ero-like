import { ArgumentMetadata, Query, PipeTransform } from '@nestjs/common';
import { IsString, MaxLength, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';

export class NickQueryDto {
    @IsString()
    @MaxLength(20)
    equal = '';
}

export class TitleQueryDto {
    @IsString()
    @MaxLength(20)
    equal = '';
}

export class PaginationFilter {
    @ValidateNested()
    @Type(() => NickQueryDto)
    nick: NickQueryDto
    @ValidateNested()
    @Type(() => TitleQueryDto)
    title: TitleQueryDto
}

export class FiltersQueryPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        let filters = {};
        if (value.nick && value.nick.equal) {
            Object.assign(filters, {
                nick: {
                    equal: value.nick.equal
                }
            })
        }
        if (value.title && value.title.equal) {
            Object.assign(filters, {
                title: {
                    equal: value.title.equal
                }
            })
        }
        return filters
    }
}

export const PaginationFilters = Query(
    new FiltersQueryPipe(),
);