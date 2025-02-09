import { IsString } from "class-validator";

export class CreateSupplierDto {

    @IsString()
    name: string

    @IsString()
    sector: string

    @IsString()
    contact_email: string

    @IsString()
    contact_phone: string

    @IsString()
    address: string

    @IsString()
    website: string

}
