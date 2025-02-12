import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetCategoryDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { neon } from '@neondatabase/serverless';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoryService {
  private readonly sql: any;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get('database_url');
    this.sql = neon(databaseUrl);
  }

  create(createCategoryDto: CreateCategoryDto): Promise<GetCategoryDto> {
    const { name, description } = createCategoryDto;
    const createSlug = name
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('.', '_');
    const createCategory = this
      .sql`INSERT INTO category (name, description, slug) VALUES (${name}, ${description}, ${createSlug}) RETURNING * `;
    return createCategory;
  }

  async findAll(limit?: number, offset?: number): Promise<GetCategoryDto[]> {
    let limit_pagination = !limit
      ? this.configService.get<number>('limit_pagination')
      : limit;
    let offset_pagination = !offset
      ? this.configService.get<number>('offset')
      : offset;

    try {
      const quantityProducts = await this.sql`SELECT count(*) FROM category`;
      const quantityPages = Math.ceil(
        quantityProducts[0].count / limit_pagination,
      );

      if (offset_pagination > quantityPages - 1) {
        offset_pagination = 0;
      }

      const allCategorys = await this
        .sql`SELECT * FROM category ORDER BY created_at asc LIMIT ${limit_pagination} OFFSET ${limit_pagination * (offset_pagination - 1 === 0 ? 1 : offset_pagination)}`;

      return allCategorys;
    } catch (error) {
      throw new InternalServerErrorException('Error getting categorys');
    }
  }

  async countCategorys(): Promise<number> {
    const count = await this.sql`select count(*) from category`;
    return count[0].count;
  }

  async findOne(id: string | number): Promise<GetCategoryDto> {
    if (isNaN(+id)) {
      const categoryById = await this
        .sql`SELECT * FROM category WHERE slug = ${id}`;
      if (categoryById.length === 0) {
        throw new NotFoundException('Category not found');
      }

      return categoryById;
    }

    const categoryById = await this
      .sql`SELECT * FROM category WHERE id = ${id}`;

    if (categoryById.length === 0) {
      throw new NotFoundException('Category not found');
    }

    return categoryById;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<GetCategoryDto> {
    const existingCategory = await this.findOne(id);

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    try {
      const { name, description, slug } = updateCategoryDto;

      const slugUpdated = name.toLowerCase().replaceAll(' ', '_');

      const updateCategory = await this.sql`UPDATE category SET 
        name = COALESCE(${name}, name), 
        description = COALESCE( ${description}, description),
        slug = COALESCE( ${slugUpdated}, slug)
        WHERE id = ${id} RETURNING *
        `;

      return updateCategory[0];
    } catch (error) {
      throw new InternalServerErrorException('Error updating category');
    }
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);

    try {
      const deleteCategory = await this
        .sql`DELETE FROM category WHERE id = ${id}`;

      if (deleteCategory.rowCount === 0) {
        throw new NotFoundException('Category not found');
      }

      return 'Category deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException('Error deleting category');
    }
  }
}
