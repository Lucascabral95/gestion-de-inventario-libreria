import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
    
        @IsString()
        @IsOptional()
        name?: string;
        
        @IsString()
        @IsOptional()
        birth_date?: string;
        
        @IsString()
        @IsOptional()
        nacionality?: string;

        @IsString()
        @IsOptional()
        biography?: string;

        @IsString()
        @IsOptional()
        image?: string;
}