import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { neon } from '@neondatabase/serverless';
import { ConfigService } from '@nestjs/config';
import { GetAuthorDto } from './dto/get-author.dto';
import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class AuthorService {
  private readonly sql: any;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get('database_url');
    this.sql = neon(databaseUrl);
  }
  async create(createAuthorDto: CreateAuthorDto): Promise<GetAuthorDto> {
    const createSlug = createAuthorDto.name
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('.', '_');;

    const createUser = await this.sql`
      INSERT INTO author (name, birth_date, nacionality, image, biography, slug)
      VALUES (${createAuthorDto.name}, ${createAuthorDto.birth_date}, ${createAuthorDto.nacionality}, ${createAuthorDto.image}, ${createAuthorDto.biography}, ${createSlug})
      RETURNING *
    `;

    return createUser;
  }

  async findAll(limit?: number, offset?: number): Promise<GetAuthorDto[]> {
    let limit_pagination = !limit
      ? this.configService.get<number>('limit_pagination')
      : limit;
    let offset_pagination = !offset
      ? this.configService.get<number>('offset')
      : offset;

    try {
      const quantityProducts = await this.sql`SELECT count(*) FROM author`;
      const quantityPages = Math.ceil(
        quantityProducts[0].count / limit_pagination,
      );

      if (offset_pagination > quantityPages - 1) {
        offset_pagination = 0;
      }

      const allProducts = await this
        .sql`SELECT * FROM author ORDER BY created_at asc LIMIT ${limit_pagination} OFFSET ${limit_pagination * (offset_pagination - 1 === 0 ? 1 : offset_pagination)}`;

      return allProducts;
    } catch (error) {
      throw new InternalServerErrorException('Error getting products');
    }
  }

  async countAuthors(): Promise<number> {
    const quantityProducts = await this.sql`SELECT count(*) FROM author`;
    return quantityProducts[0].count;
  }

  async findOne(id: string | number): Promise<GetAuthorDto> {
    if (isNaN(+id)) {
      const authorById = await this
        .sql`SELECT * FROM author WHERE slug = ${id}`;

      if (authorById.length === 0) {
        throw new NotFoundException('Author with slug ' + id + ' not found');
      }

      return authorById;
    }

    const authorById = await this.sql`SELECT * FROM author WHERE id = ${id}`;

    if (authorById.length === 0) {
      throw new NotFoundException('Author with id ' + id + ' not found');
    }

    return authorById;
  }

  async update(
    id: number,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<GetAuthorDto> {
     await this.findOne(id);

    const { name, birth_date, nacionality, image, biography } = updateAuthorDto;

    const slugUpdated = name
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('.', '_');

    const updateAuthor = await this
      .sql`UPDATE author SET 
      name = coalesce(${name}, name),
      birth_date = coalesce(${birth_date}, birth_date),
      nacionality = coalesce(${nacionality}, nacionality),
      image = coalesce(${image}, image),
      slug = coalesce(${slugUpdated}, slug),
      biography = coalesce(${biography}, biography) 
      WHERE id = ${id} RETURNING *
      `;

    return updateAuthor;
  }

  async remove(id: number): Promise<string> {
    await this.findOne(id);

    const removeAuthor = await this.sql`DELETE FROM author WHERE id = ${id}`;

    if (removeAuthor.rowCount === 0) {
      throw new NotFoundException('Author not found');
    }

    return `Author deleted successfully`;
  }

  getImageByAuthorByImage(authorId: string) {
    const path = join(__dirname, '../../static/uploads/authors', authorId);

    if (!existsSync(path)) {
      throw new BadRequestException(`No author found with imagen ${authorId}`);
    }

    return path;
  }
}
