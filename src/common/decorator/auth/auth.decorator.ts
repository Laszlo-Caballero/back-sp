import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard';

export const Auth = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
