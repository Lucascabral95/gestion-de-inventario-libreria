import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetProductDto {

    @IsNumber()
    id: number

    @IsString()
    name: string

    @IsString()
    slug: string

    @IsString()
    author: string

    @IsString()
    publication_date: string

    @IsNumber()
    quantity_pages: number

    @IsString()
    language: string

    @IsString()
    @IsOptional()
    image?: string

    @IsString()
    synopsis: string
    
    @IsString()
    sku: string

    @IsNumber()
    price: number

    @IsNumber()
    stock: number

    @IsNumber()
    category_id: number

    @IsNumber()
    supplier_id: number

    @IsString()
    created_at: Date

    @IsString()
    updated_at: Date

}