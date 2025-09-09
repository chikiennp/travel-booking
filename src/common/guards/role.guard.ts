import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || !roles.length) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayloadInterface }>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    const isMatched = matchRoles(roles, user.roles);
    if (!isMatched) {
      throw new UnauthorizedException('Unauthorized access');
    }
    return true;
  }
}

function matchRoles(allowedRoles: string[], userRoles: string[]) {
  if (userRoles.some((role) => allowedRoles.includes(role))) return true;
}
