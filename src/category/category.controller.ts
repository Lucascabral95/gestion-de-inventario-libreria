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
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard())
  @Post()                       
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser('admin') user: string,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.categoryService.findAll(limit, offset);
  }

  @Get('count')
  count() {
    return this.categoryService.countCategorys()
  }

  @Get(':id')
  findOne(@Param('id') id: string | number) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
   @GetUser('admin') user: string,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('admin') user: string,
  ) {
    return this.categoryService.remove(id);
  }
}
