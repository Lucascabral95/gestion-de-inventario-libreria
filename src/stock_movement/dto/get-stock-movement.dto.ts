import { isNumber, IsNumber, IsString } from "class-validator";

export class GetStockMovementDto {

    @IsNumber()
    id: number

    @IsNumber()
    product_id: number

    @IsNumber()
    user_id: number
    
    @IsString()
    movement_type: 'in' | 'out'

    @IsNumber()
    quantity: number

    @IsString()
    created_at: Date

    @IsString()
    updated_at: Date

}

export class GetStockMovementWithUserAndProductDto extends GetStockMovementDto {

    @IsNumber()
    users_id: number

    @IsString()
    users_email: string

    @IsString()
    users_full_name: string

    @IsString()
    users_is_active: string
    
    @IsString()
    users_role: string

    @IsNumber()
    product_id: number

    @IsString()
    product_name: string 

    @IsNumber()
    product_price: number

    @IsNumber()
    product_stock: number

    @IsString()
    product_author: string 

    @IsNumber()
    product_quantity_pages: number 

    @IsString()
    product_publication_date: string

    @IsString()
    product_language: string

    @IsString()
    product_synopsis: string

    @IsString()
    product_image: string

    @IsNumber()
    total_amount: number
}

export class GetProductsMostSelledDTO {
    
    @IsString()    
    product_name: string;

    @IsNumber()
    total_price_products: number;

    @IsNumber()
    total_quantity: number;

}