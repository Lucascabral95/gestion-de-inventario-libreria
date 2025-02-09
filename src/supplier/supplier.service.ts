import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto, UpdateSupplierDto, GetSupplierDto } from './dto';
import { neon } from '@neondatabase/serverless';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupplierService {
  private readonly sql: any;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get('database_url');
    this.sql = neon(databaseUrl);
  }

  async create(createSupplierDto: CreateSupplierDto): Promise<GetSupplierDto> {
    const createSupplier = await this
      .sql`INSERT INTO supplier (name, sector, contact_email, contact_phone, address, website) VALUES (${createSupplierDto.name}, ${createSupplierDto.sector}, ${createSupplierDto.contact_email}, ${createSupplierDto.contact_phone}, ${createSupplierDto.address}, ${createSupplierDto.website}) RETURNING *`;

    return createSupplier;
  }

  async findAll(limit?: number, offset?: number): Promise<GetSupplierDto[]> {
    let limit_pagination = !limit
      ? this.configService.get<number>('limit_pagination')
      : limit;
    let offset_pagination = !offset
      ? this.configService.get<number>('offset')
      : offset;

    try {
      const quantityProducts = await this.sql`SELECT count(*) FROM supplier`;
      const quantityPages = Math.ceil(
        quantityProducts[0].count / limit_pagination,
      );

      if (offset_pagination > quantityPages - 1) {
        offset_pagination = 0;
      }

      const allSuppliers = await this
        .sql`SELECT * FROM supplier ORDER BY created_at asc LIMIT ${limit_pagination} OFFSET ${limit_pagination * (offset_pagination - 1 === 0 ? 1 : offset_pagination)}`;

      return allSuppliers;
    } catch (error) {
      throw new InternalServerErrorException('Error getting suppliers');
    }
  }

  async countSuppliers(): Promise<number> {
    const allSuppliers = await this.sql`select count(*) from supplier`;
    return allSuppliers[0].count;
  }

  async findOne(id: number): Promise<GetSupplierDto> {
    const supplierById = await this
      .sql`SELECT * FROM supplier WHERE id = ${id}`;

    if (supplierById.length === 0) {
      throw new NotFoundException('Supplier not found');
    }

    return supplierById;
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<GetSupplierDto> {
    const { name, sector, contact_email, contact_phone, address, website } =
      updateSupplierDto;
    await this.findOne(id);

    try {
      const updateSupplier = await this.sql`UPDATE supplier SET 
        name = ${name}, 
        sector = coalesce(${sector}, sector), 
        contact_email = coalesce(${contact_email}, contact_email), 
        contact_phone = coalesce(${contact_phone}, contact_phone),
        address = coalesce(${address}, address),
        website = coalesce(${website}, website) 
        WHERE id = ${id} RETURNING *
        `;

      return updateSupplier[0];
    } catch (error) {
      throw new InternalServerErrorException('Error updating supplier');
    }
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);

    try {
      const deleteSupplier = await this
        .sql`DELETE FROM supplier WHERE id = ${id}`;

      if (deleteSupplier.rowCount === 0) {
        throw new NotFoundException('Supplier not found');
      }

      return 'Supplier deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException('Error deleting supplier');
    }
  }
}
