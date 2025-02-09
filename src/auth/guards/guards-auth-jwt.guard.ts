import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CombinedGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenJWT = request.cookies['token-gestion-inventario'];

    if (!tokenJWT) {
      throw new UnauthorizedException('Token not found');
    }

    const decodedToken = this.jwtService.decode(tokenJWT);

    if (!decodedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const { role, is_active } = decodedToken as { role?: string; is_active?: boolean };

    if (role !== 'admin') {
      throw new ForbiddenException('Insufficient permissions');
    }

    if (is_active === false) {
      throw new UnauthorizedException('Inactive account');
    }

    request.headers['authorization'] = `Bearer ${tokenJWT}`;

    return true;
  }
}
