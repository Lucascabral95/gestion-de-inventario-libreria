import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  GetStockMovementDto,
  CreateStockMovementDto,
  UpdateStockMovementDto,
  GetStockMovementWithUserAndProductDto,
  GetProductsMostSelledDTO,
} from './dto';
import { neon } from '@neondatabase/serverless';
import { ConfigService } from '@nestjs/config';
import { ProductService } from 'src/product/product.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class StockMovementService {
  private readonly sql: any;

  constructor(
    private configService: ConfigService,
    private productService: ProductService,
    private authService: AuthService,
  ) {
    const databaseUrl = this.configService.get('database_url');
    this.sql = neon(databaseUrl);
  }

  async create(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<GetStockMovementDto> {
    const { product_id, user_id, movement_type, quantity } =
      createStockMovementDto;

    await this.productService.findOne(product_id);
    await this.authService.findOne(user_id);

    const stockMovement = await this
      .sql`INSERT INTO stock_movement (product_id, user_id, movement_type, quantity) VALUES (${product_id}, ${user_id}, ${movement_type}, ${quantity}) RETURNING *`;

    return stockMovement[0];
  }

  async findAll(): Promise<GetStockMovementDto[]> {
    const findAllStockMovement = await this.sql`SELECT * FROM stock_movement`;

    return findAllStockMovement;
  }

  async findOne(id: number): Promise<GetStockMovementDto> {
    const findById = await this
      .sql`SELECT * FROM stock_movement WHERE id = ${id}`;

    if (findById.length === 0) {
      throw new NotFoundException(`StockMovement with id ${id} not found`);
    }

    return findById;
  }

  async findAllWithUserProduct(): Promise<
    GetStockMovementWithUserAndProductDto[]
  > {
    const findAllStockMovement = await this
      .sql`SELECT * FROM stock_movements_with_user_producto  ORDER BY created_at asc`;

    return findAllStockMovement;
  }

  async findAllWithUserProductById(
    id: number,
  ): Promise<GetStockMovementWithUserAndProductDto> {
    const findAllStockMovement = await this
      .sql`SELECT * FROM stock_movements_with_user_producto where id = ${id} ORDER BY created_at asc`;

    if (findAllStockMovement.length === 0) {
      throw new NotFoundException(`StockMovement with id ${id} not found`);
    }

    return findAllStockMovement;
  }

  // Obtenecion de datos generales del ecommerce para llenar el dashboard
  async findAllResources(): Promise<{
    quantitySupliers: number;
    quantityProducts: number;
    quantityCategorys: number;
    articulesMostSell: GetProductsMostSelledDTO[];
    totalExpeditures: any;
    totalIncome: any;
    totalProducts: number,
  }> {
    try {
      const countSuppliers = await this
        .sql`SELECT COUNT(*) as count from supplier`;
      const countProducts = await this
        .sql`SELECT COUNT(*) as count FROM product`;
      const countCategorys = await this
        .sql`SELECT COUNT(*) as count FROM category`;
        const totalProducts = await this.sql`select sum(stock) as products_total from product`;

      const articulesMostSell = await this.sql`
      SELECT product_name, SUM(quantity * product_price) as total_price_products, SUM(quantity) as total_quantity 
      FROM stock_movements_with_user_producto 
      GROUP BY product_name
      ORDER BY total_quantity DESC
      LIMIT 3
    `;

      const totalExpeditures = await this.sql`select sum(quantity) as products_total_selled, SUM(quantity * product_price) as total_price from stock_movements_with_user_producto where movement_type = 'out'`;
      const totalIncome = await this.sql`select sum(quantity) as products_total_buyed, SUM(quantity * product_price) as total_price from stock_movements_with_user_producto where movement_type = 'in'`;

      return {
        quantitySupliers: Number(countSuppliers[0].count),
        quantityProducts: Number(countProducts[0].count),
        quantityCategorys: Number(countCategorys[0].count),
        articulesMostSell: articulesMostSell,
        totalExpeditures: totalExpeditures[0],
        totalIncome: totalIncome[0],
        totalProducts: Number(totalProducts[0].products_total),
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error getting products');
    }
  }
  // Obtenecion de datos generales del ecommerce para llenar el dashboard

  async update(
    id: number,
    updateStockMovementDto: UpdateStockMovementDto,
  ): Promise<GetStockMovementDto> {
    await this.findOne(id);

    try {
      const { product_id, user_id, movement_type, quantity } =
        updateStockMovementDto;
      await this.productService.findOne(product_id);
      await this.authService.findOne(user_id);

      const updateStockMovement = await this.sql`UPDATE stock_movement SET 
        product_id = coalesce(${product_id}, product_id),
        user_id = coalesce(${user_id}, user_id),
        movement_type = coalesce(${movement_type}, movement_type),
        quantity = coalesce(${quantity}, quantity) 
        WHERE id = ${id} RETURNING *
        `;

      return updateStockMovement[0];
    } catch (error) {
      throw new InternalServerErrorException('Error updating stockMovement');
    }
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);

    try {
      const deleteStockMovement = await this
        .sql`DELETE FROM stock_movement WHERE id = ${id}`;

      if (deleteStockMovement.rowCount === 0) {
        throw new NotFoundException('StockMovement not found');
      }

      return 'StockMovement deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException('Error deleting stockMovement');
    }
  }
}
