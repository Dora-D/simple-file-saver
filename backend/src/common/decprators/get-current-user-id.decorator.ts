import { User } from '@app/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();

    const user = request.user as User;
    return user.id;
  },
);
