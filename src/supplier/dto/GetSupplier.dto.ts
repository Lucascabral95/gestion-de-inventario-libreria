import { IsNumber, IsString } from 'class-validator';

export class GetSupplierDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  contact_email: string;

  @IsString()
  contact_phone: string;

  @IsString()
  address: string;

  @IsString()
  website: string;

  @IsString()
  created_at: Date;
}
