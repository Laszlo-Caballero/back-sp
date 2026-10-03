import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

export const Auth = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
