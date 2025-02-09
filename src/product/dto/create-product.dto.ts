import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsString()
    name: string

    @IsString()
    author: string

    @IsString()
    publication_date: string

    @IsString()
    synopsis: string

    @IsOptional()
    image: string | Express.Multer.File

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    quantity_pages: number

    @IsString()
    language: string

    @IsNumber()
    @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(2)))
    price: number 

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    stock: number
    
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    category_id: number
    
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    supplier_id: number

}
