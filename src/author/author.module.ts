import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AuthorController],
  providers: [AuthorService],
  imports: [ ConfigModule, AuthModule ],
})
export class AuthorModule {}
