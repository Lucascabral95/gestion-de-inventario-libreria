import { PartialType } from '@nestjs/mapped-types';
import { CreateStockMovementDto } from './create-stock_movement.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

enum MovementType {
  IN = 'in',
  OUT = 'out',
}

export class UpdateStockMovementDto extends PartialType(
  CreateStockMovementDto,
) {

  @IsNumber()
  @IsOptional()
  product_id: number;
  
  @IsNumber()
  @IsOptional()
  user_id: number;
  
  @IsEnum(MovementType)
  @IsOptional()
  movement_type: MovementType;
  
  @IsNumber()
  @IsOptional()
  quantity: number;
  
}
