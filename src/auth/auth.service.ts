import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateAuthDto,
  UpdateAuthDto,
  GetUserDto,
  LoginUserDto,
  PayloadJwtDto,
} from './dto';
import { neon, NeonDbError } from '@neondatabase/serverless';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly sql: any;

  constructor(
    private configService: ConfigService,

    private readonly jwtService: JwtService,
  ) {
    const databaseUrl = this.configService.get('database_url');
    this.sql = neon(databaseUrl);
  }

  async create(createAuthDto: CreateAuthDto): Promise<GetUserDto> {
    const { email, password, full_name, role } = createAuthDto;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const emailLowerCase = email.toLowerCase();
    const users = await this.findAll();
    const usersExists = users.find((user) => user.email === emailLowerCase);

    if (usersExists) {
      throw new InternalServerErrorException('Email already exists');
    }

    const createUser = this
      .sql` INSERT INTO users (email, password, full_name, role) VALUES (${emailLowerCase}, ${hashedPassword}, ${full_name}, ${role}) RETURNING * `;

    return createUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ message: string; token: string }> {
    try {
      const users = await this.findAll();

      const user = users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase(),
      );

      const payload = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        is_active: user.is_active,
        role: user.role,
      };

      if (!user) {
        throw new NotFoundException(`No user found with email: ${email}`);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        message: 'Login successful',
        token: this.getJwtToken(payload),
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  private getJwtToken(payload: PayloadJwtDto) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAll(): Promise<GetUserDto[]> {
    try {
      const allUsers = await this.sql`SELECT * FROM users`;
      return allUsers || [];
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async findOne(id: number): Promise<GetUserDto> {
    const usersById = await this.sql`SELECT * FROM users WHERE id = ${id}`;

    if (usersById.length === 0) {
      throw new NotFoundException('Employee not found');
    }

    return usersById;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto): Promise<GetUserDto> {
    await this.findOne(id);
    
    const { email, full_name, is_active, role } = updateAuthDto;

    try {
      const updatedUser = await this.sql`
        UPDATE users
        SET 
        email = coalesce(${email}, email),
        full_name = coalesce(${full_name}, full_name),
         is_active = coalesce(${is_active}, is_active),
          role = coalesce(${role}, role)
        WHERE id = ${id}
        RETURNING *
      `;

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number): Promise<{ message: string; result: number }> {
    const userSelected = await this.findOne(id);

    try {
      if (!userSelected) {
        throw new BadRequestException('Employee not found');
      }

      const userDeleted = await this.sql`DELETE FROM users WHERE id = ${id}`;

      if (userDeleted.rowCount === 0) {
        throw new BadRequestException('Employee not found');
      }

      return {
        message: 'Employee deleted successfully',
        result: userDeleted.rowCount,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting employee');
    }
  }

  codeError(error: NeonDbError) {
    if (
      error.message.includes(
        'duplicate key value violates unique constraint "users_email_key"',
      )
    ) {
      return new InternalServerErrorException('Email already exists');
    } else {
      return new InternalServerErrorException('Internal server error');
    }
  }
}
