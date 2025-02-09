import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
  imports: [ConfigModule, AuthModule],
})
export class SupplierModule {}
