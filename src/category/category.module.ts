import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ CategoryController ],
  providers: [ CategoryService ],
  imports: [ ConfigModule, AuthModule ],
})
export class CategoryModule {}
