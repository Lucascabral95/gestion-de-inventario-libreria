import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [ConfigModule, AuthModule],
  exports: [ ProductService, ProductModule ],
})
export class ProductModule {}
