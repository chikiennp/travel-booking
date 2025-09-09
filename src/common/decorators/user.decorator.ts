import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadInterface } from 'src/common/interfaces/jwt-payload.interface';

export const User = createParamDecorator(
  (data: keyof JwtPayloadInterface | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayloadInterface }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
