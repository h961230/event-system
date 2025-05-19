import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly whitelist = [
    { method: 'POST', path: '/auth/login' },
    { method: 'POST', path: '/auth/signup' },
  ];
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const method = request.method.toUpperCase();
    const path = request.url.split('?')[0];

    const isWhitelisted = this.whitelist.some(
      (rule) => rule.method === method && rule.path === path,
    );
    if (isWhitelisted) return true;

    const authHeader = request.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('JWT 토큰 없음');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      request.user = decoded;
      request.headers['x-user-email'] = decoded.email;
      return true;
    } catch {
      throw new UnauthorizedException('JWT 토큰이 유효하지 않음');
    }
  }
}
