import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

enum Role {
  Employee = 'employee',
  Admin = 'admin',
}

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  full_name?: string;
  
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
  
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
