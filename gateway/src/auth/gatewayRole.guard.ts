import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { routeRolesMap } from './rolesMap';

@Injectable()
export class GatewayRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const method = req.method.toUpperCase();

    const urlPath = req.url.split('?')[0];

    const matchedKey = Object.keys(routeRolesMap).find((key) => {
      const [expectedMethod, expectedPath] = key.split(' ');

      if (expectedMethod !== method) return false;

      const pathRegex = new RegExp(
        '^' + expectedPath.replace(/:[^/]+/g, '[^/]+') + '$',
      );
      return pathRegex.test(urlPath);
    });

    if (!matchedKey) {
      return true;
    }

    const allowedRoles = routeRolesMap[matchedKey];
    const hasRole = user?.roles?.some((role: string) =>
      allowedRoles.includes(role),
    );

    if (!hasRole && allowedRoles.length != 0) {
      throw new ForbiddenException(`권한 실패: ${user?.roles}`);
    }

    return true;
  }
}
