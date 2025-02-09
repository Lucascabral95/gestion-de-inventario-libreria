import { IsBoolean, IsNumber, IsString } from "class-validator";

export class PayloadJwtDto {

    @IsNumber()
    id: number;

    @IsString()
    email: string;

    @IsString()
    full_name: string;

    @IsBoolean()
    is_active: boolean;

    @IsString()
    role: string;
}