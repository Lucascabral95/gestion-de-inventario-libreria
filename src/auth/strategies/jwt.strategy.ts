import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GetUserDto, PayloadJwtDto } from '../dto';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt_secret'),
    });
  }

  async validate(payload: PayloadJwtDto): Promise<GetUserDto> {
    const { id } = payload;

    const user = await this.authService.findOne(id);

    if (!user) throw new UnauthorizedException('Token not valid');

    if (user.is_active === false)
      throw new UnauthorizedException('User is inactive, talk with an admin');

    return user;
  }
}
