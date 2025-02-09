import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, UpdateAuthDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard())
  @Post()
  create(@Body() createAuthDto: CreateAuthDto, @GetUser('admin') user: string) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ) {
    const { token } = await this.authService.login(
      loginUserDto.email,
      loginUserDto.password,
    );
    const tokenDurationFilter = this.configService
      .get('duration_jwt')
      .split('h')[0];

    res.cookie('token-gestion-inventario', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenDurationFilter * 1000 * 60 * 60,
      path: '/',
    });

    res.send({ message: 'Login successful', token });

    return this.authService.login(loginUserDto.email, loginUserDto.password);
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll(@GetUser('employee') user: string) {
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('employee') user: string) {
    return this.authService.findOne(+id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthDto: UpdateAuthDto,
    @GetUser('admin') user: string,
  ) {
    return this.authService.update(+id, updateAuthDto);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('admin') user: string,
  ) {
    return await this.authService.remove(id);
  }
}
