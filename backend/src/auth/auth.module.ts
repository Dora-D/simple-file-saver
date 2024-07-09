import { Module } from '@nestjs/common';
import { GoogleModule } from '@app/auth/google/google.module';
import { JwtAuthModule } from '@app/auth/jwt/jwt-auth.module';

@Module({
  controllers: [],
  providers: [],
  imports: [GoogleModule, JwtAuthModule],
})
export class AuthModule {}
