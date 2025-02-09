import { IsNumber, IsString } from "class-validator";

export class GetAuthorDto {

    @IsNumber()
    id: number;

    @IsString()
    name: string;
    
    @IsString()
    birth_date: string;
    
    @IsString()
    nacionality: string;
    
    @IsString()
    biography: string;

    @IsString()
    image: string;

    @IsString()
    slug: string;
    
    @IsString()
    created_at: string;
}