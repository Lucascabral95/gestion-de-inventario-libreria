import { IsOptional, IsString } from "class-validator";

export class CreateAuthorDto {

    @IsString()
    name: string;

    @IsString()
    birth_date: string;
    
    @IsString()
    nacionality: string;
    
    @IsString()
    biography: string;
    
    @IsOptional()
    image?: string | Express.Multer.File;
}
