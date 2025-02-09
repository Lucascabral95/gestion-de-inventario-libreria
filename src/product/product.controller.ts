import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard())
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads/products',
        filename: fileNamer,
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @GetUser('admin') user: string,
  ) {
    const product = this.productService.create({
      ...createProductDto,
      image: file.filename,
    });

    return product;
  }

  @Get()
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.productService.findAll(limit, offset);
  }

  @Get('count')
  countProducts(): Promise<number> {
    return this.productService.countProducts();
  }

  @Get('with-author')
  findAllWithAuthor() {
    return this.productService.findAllWithAuthor();
  }

  @Get('/with-author/:slug')
  findProductByIdWithAuthor(@Param('slug') slug: string) {
    return this.productService.findProductByIdWithAuthor(slug);
  }

  @Get('/with-author/category/:slug')
  findProductWithAuthorForCategorySlug(@Param('slug') slug: string) {
    return this.productService.findProductBySlugCategory(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Get('/slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser('admin') user: string,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('admin') user: string,
  ) {
    return this.productService.remove(id);
  }

  @Get('image/product/:imageName')
  findOneProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.productService.getStaticProductImages(imageName);

    res.sendFile(path);
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${file.filename}`;

    return {
      secureUrl,
    };
  }
}
