import { ArgumentMetadata, Query, ValidationPipe } from '@nestjs/common';
import { IsIn, IsInt, Min, IsString, MaxLength } from 'class-validator';

export class NickQueryDto {
    @IsString()
    @MaxLength(20)
    equal = '';
}

export class FiltersQueryPipe extends ValidationPipe {
    transform(
        query: any, // I guess it's possible to move the condition described in the 'if' block here
        metadata: ArgumentMetadata
        ): Promise<NickQueryDto> {
        const result = new NickQueryDto();
        if (query.nick) {
            result.equal = query.nick.equal.match(/^[a-zA-Z]+$/) ? query.nick.equal : null;
        }
        return super.transform(result, metadata);
    }
}


export const FiltersQuery = Query(
    new FiltersQueryPipe({ whitelist: true, transform: true }),
);