import { Module } from '@nestjs/common';
import { StockMovementService } from './stock_movement.service';
import { StockMovementController } from './stock_movement.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [StockMovementController],
  providers: [StockMovementService],
  imports: [ConfigModule, ProductModule, AuthModule, AuthModule],
})
export class StockMovementModule {}
