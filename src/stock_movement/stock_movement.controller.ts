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
} from '@nestjs/common';
import { StockMovementService } from './stock_movement.service';
import { CreateStockMovementDto } from './dto/create-stock_movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock_movement.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@UseGuards( AuthGuard() )
@Controller('stock-movement')
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Post()
  create(
    @Body() createStockMovementDto: CreateStockMovementDto,
    @GetUser('employee') user: string,
  ) {
    return this.stockMovementService.create(createStockMovementDto);
  }

  @Get()
  findAll(
    @GetUser('employee') user: string
  ) {
    return this.stockMovementService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('employee') user: string,
  ) {
    return this.stockMovementService.findOne(id);
  }

  @Get('with/user/product')
  findAllWithUserProduct(
    @GetUser('employee') user: string
  ) {
    return this.stockMovementService.findAllWithUserProduct();
  }

  @Get('with/user/product/:id')
  findAllWithUserProductById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('employee') user: string
  ) {
    return this.stockMovementService.findAllWithUserProductById(id);
  }

  @Get('inventory/resources')
  findAllResources(
    @GetUser('employee') user: string
  ) {
    return this.stockMovementService.findAllResources();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockMovementDto: UpdateStockMovementDto,
    @GetUser('employee') user: string,
  ) {
    return this.stockMovementService.update(id, updateStockMovementDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('admin') user: string,
  ) {
    return this.stockMovementService.remove(id);
  }
}
