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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

// @UseGuards(AuthGuard())
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    // @GetUser('admin') user: string,
  ) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  findAll(
    // @GetUser('employee') user: string
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number
  ) 
    {
    return this.supplierService.findAll(limit, offset);
  }

  @Get('count')
  count() {
    return this.supplierService.countSuppliers()
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    // @GetUser('employee') user: string,
  ) {
    return this.supplierService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
    // @GetUser('admin') user: string,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
   // @GetUser('admin') user: string,
  ) {
    return this.supplierService.remove(+id);
  }
}
