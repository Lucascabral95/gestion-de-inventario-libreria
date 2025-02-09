import { IsNumber, IsString } from "class-validator";

export class GetCategoryDto {

    @IsNumber()
    id: number

    @IsString()
    name: string

    @IsString()
    description: string

    @IsString()
    created_at: Date

}