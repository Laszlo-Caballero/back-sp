import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, RequestUser } from '../../interfaces/interface';

export const User = createParamDecorator(
  (data: keyof JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestUser>();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
