import { IsBoolean, IsEnum, IsOptional, IsString, Matches } from 'class-validator';

enum Role {
  Employee = 'employee',
  Admin = 'admin',
}

export class CreateAuthDto {
  @IsString()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,\-_])[A-Za-z\d@$!%*?&.,\-_]{8,}$/,
    { message: 'Password must have at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.' }
  )
  password: string;

  @IsString()
  full_name: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
