import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './create-supplier.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sector?: string;
  
  @IsString()
  @IsOptional()
  contact_email?: string;
  
  @IsString()
  @IsOptional()
  contact_phone?: string;
  
  @IsString()
  @IsOptional()
  address?: string;
  
  @IsString()
  @IsOptional()
  website?: string;
}
