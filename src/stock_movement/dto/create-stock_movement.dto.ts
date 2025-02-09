import { IsEnum, IsNumber, IsString } from 'class-validator';

enum MovementType {
  IN = 'in',
  OUT = 'out',
}

export class CreateStockMovementDto {

  @IsNumber()
  product_id: number;

  @IsNumber()
  user_id: number;

  @IsEnum(MovementType)
  movement_type: MovementType;

  @IsNumber()
  quantity: number;
}
