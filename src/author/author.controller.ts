import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Res,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from 'src/product/helpers';
import { diskStorage } from 'multer';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads/authors',
        filename: fileNamer,
      }),
    }),
  )
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createAuthorDto: CreateAuthorDto,
    @GetUser('admin') user: string,
  ) {
    const newAuthor = await this.authorService.create({
      ...createAuthorDto,
      image: file.filename,
    });
    return {
      message: 'Autor creado exitosamente',
      author: newAuthor,
    };
  }

  @Get()
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.authorService.findAll(limit, offset);
  }

  @Get('count')
  countAuthors() {
    return this.authorService.countAuthors();
  }

  @Get('image/author/:imageAuthor')
  findOneImageAuthor(
    @Param('imageAuthor') imageAuthor: string,
    @Res() res: Response,
  ) {
    const path = this.authorService.getImageByAuthorByImage(imageAuthor);

    res.sendFile(path);
  }

  @Get(':id')
  findOne(@Param('id') id: string | number) {
    return this.authorService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
    @GetUser('admin') user: string,
  ) {
    return this.authorService.update(+id, updateAuthorDto);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: number, @GetUser('admin') user: string) {
    return this.authorService.remove(+id);
  }
}
