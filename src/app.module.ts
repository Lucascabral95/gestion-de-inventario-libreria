import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { SupplierModule } from './supplier/supplier.module';
import { StockMovementModule } from './stock_movement/stock_movement.module';
import { CategoryModule } from './category/category.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: [
        EnvConfiguration
      ]
    }),

    AuthModule,

    ProductModule,

    SupplierModule,

    StockMovementModule,

    CategoryModule,

    AuthorModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
