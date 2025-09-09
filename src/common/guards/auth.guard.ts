import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { IS_PUBLIC_KEY } from '../constants/auth.constants';
import { REDIS_CLIENT } from '../constants/redis.constants';
import * as redis from 'redis';
import { ErrorMessage } from '../enums/message.enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject(REDIS_CLIENT) private readonly redisClient: redis.RedisClientType,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(ErrorMessage.TOKEN_NOT_PROVIDED);
    }
    let payload: JwtPayloadInterface;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayloadInterface>(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Failed to verify');
    }
    const redisToken = await this.redisClient.get(`auth:token:${payload.sub}`);
    if (!redisToken || redisToken !== token) {
      throw new UnauthorizedException(ErrorMessage.TOKEN_REVOKED);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
