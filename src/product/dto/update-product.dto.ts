import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    @IsString()
    @IsOptional()
    name?: string
    
    @IsString()
    @IsOptional()
    sku?: string

    @IsString()
    @IsOptional()
    slug?: string

    @IsString()
    @IsOptional()
    author?: string

    @IsString()
    @IsOptional()
    publication_date?: string

    @IsString()
    @IsOptional()
    language?: string
    
    @IsString()
    @IsOptional()
    synopsis?: string

    @IsNumber()
    @IsOptional()
    quantity_pages?: number

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(2))) 
    price?: number

    @IsNumber()
    @IsOptional()
    stock?: number

    @IsNumber()
    @IsOptional()
    category_id?: number

    @IsNumber()
    @IsOptional()
    supplier_id?: number

}
