import { IsBoolean, IsNumber, IsString } from "class-validator";

export class GetUserDto {

    @IsNumber()
    id: number

    @IsString()
    email: string
    
    @IsString()
    password: string

    @IsString()
    full_name: string

    @IsBoolean()
    is_active: boolean

    @IsString()
    role: 'employee' | 'admin';

}