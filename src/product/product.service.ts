import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  GetProductDto,
  CreateProductDto,
  UpdateProductDto,
  GetProductsWithAuthorDto,
} from './dto';
import { neon } from '@neondatabase/serverless';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class ProductService {
  private readonly sql: any;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get('database_url');
    this.sql = neon(databaseUrl);
  }

  async create(createProductDto: CreateProductDto) {
    const {
      name,
      price,
      stock,
      author,
      publication_date,
      quantity_pages,
      image,
      language,
      synopsis,
      category_id,
      supplier_id,
    } = createProductDto;
    const creationSku = uuid();
    
    const slug = name
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('.', '_')
      .replaceAll(',', '_')
      .replaceAll(';', '_');

    const createProduct = await this
      .sql`insert into product (name, slug, sku, price, stock, author, publication_date, quantity_pages, image, language, synopsis, category_id, supplier_id) values (${name}, ${slug}, ${creationSku}, ${price}, ${stock}, ${author}, ${publication_date}, ${quantity_pages}, ${image}, ${language}, ${synopsis}, ${category_id}, ${supplier_id}) returning *`;

    return createProduct;
  }

  async findAll(limit?: number, offset?: number): Promise<GetProductDto[]> {
    let limit_pagination = !limit
      ? this.configService.get<number>('limit_pagination')
      : limit;
    let offset_pagination = !offset
      ? this.configService.get<number>('offset')
      : offset;

    try {
      const quantityProducts = await this.sql`SELECT count(*) FROM product`;
      const quantityPages = Math.ceil(
        quantityProducts[0].count / limit_pagination,
      );

      if (offset_pagination > quantityPages - 1) {
        offset_pagination = 0;
      }

      const allProducts = await this
        .sql`SELECT * FROM product ORDER BY created_at asc LIMIT ${limit_pagination} OFFSET ${limit_pagination * (offset_pagination - 1 === 0 ? 1 : offset_pagination)}`;

      return allProducts;
    } catch (error) {
      throw new InternalServerErrorException('Error getting products');
    }
  }

  async countProducts(): Promise<number> {
    const quantityProducts = await this.sql`SELECT count(*) FROM product`;
    return quantityProducts[0].count;
  }

  async findOne(id: number): Promise<GetProductDto> {
    const productById = await this.sql`SELECT * FROM product WHERE id = ${id}`;

    if (productById.length === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return productById;
  }

  async findBySlug(slug: string): Promise<GetProductDto> {
    const productBySlug = await this
      .sql`SELECT * FROM product WHERE slug = ${slug}`;

    if (productBySlug.length === 0) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return productBySlug;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    const existingProduct = await this.findOne(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    try {
      const {
        name,
        sku,
        author,
        publication_date,
        language,
        synopsis,
        quantity_pages,
        price,
        stock,
        category_id,
        supplier_id,
      } = updateProductDto;
  
      const slug = name
        ?.toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[.,]/g, '_');
  
      const updatedProduct = await this.sql`
        UPDATE product SET 
          name = COALESCE(${name}, name),
          sku = COALESCE(${sku}, sku),
          slug = COALESCE(${slug}, slug),
          author = COALESCE(${author}, author),
          publication_date = COALESCE(${publication_date}, publication_date),
          language = COALESCE(${language}, language),
          synopsis = COALESCE(${synopsis}, synopsis),
          quantity_pages = COALESCE(${quantity_pages}, quantity_pages),
          price = COALESCE(${price}, price),
          stock = COALESCE(${stock}, stock),
          category_id = COALESCE(${category_id}, category_id),
          supplier_id = COALESCE(${supplier_id}, supplier_id)
        WHERE id = ${id} 
        RETURNING *
      `;
  
      if (!updatedProduct.length) {
        throw new NotFoundException(`Failed to update product with ID ${id}`);
      }
  
      return updatedProduct[0];
    } catch (error) {
      throw new InternalServerErrorException(`Error updating product: ${error.message}`);
    }
  }  

  async remove(id: number): Promise<string> {
    await this.findOne(id);

    try {
      const deleteProduct = await this
        .sql`DELETE FROM product WHERE id = ${id}`;

      if (deleteProduct.rowCount === 0) {
        throw new NotFoundException('Product not found');
      }

      return `Product deleted successfully`;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting product');
    }
  }

  getStaticProductImages(imageName: string) {
    const path = join(__dirname, '../../static/uploads/products', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(
        `No product found with imagen ${imageName}`,
      );
    }

    return path;
  }

  async findProductByIdWithAuthor(
    slug: string,
  ): Promise<GetProductsWithAuthorDto> {
    const search = slug.trim();

    const allProducts = await this
      .sql`SELECT * FROM products_with_author where slug = ${search}`;

    if (allProducts.length === 0) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return allProducts;
  }

  async findAllWithAuthor(): Promise<GetProductsWithAuthorDto[]> {
    const allProducts = await this
      .sql`SELECT * FROM products_with_author ORDER BY created_at asc`;

    return allProducts;
  }

  async findProductBySlugCategory(
    slug: string,
  ): Promise<GetProductsWithAuthorDto[]> {
    const allProducts = await this
      .sql`SELECT * FROM products_with_author where slug_category = ${slug}`;

    if (allProducts.length === 0) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return allProducts;
  }
}
