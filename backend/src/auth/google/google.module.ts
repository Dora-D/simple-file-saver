import { GoogleController } from '@app/auth/google/google.controller';
import { JwtAuthModule } from '@app/auth/jwt/jwt-auth.module';
import { GoogleStrategy } from './google.strategy';
import { Module } from '@nestjs/common';
import { UsersModule } from '@app/users/users.module';

@Module({
  imports: [UsersModule, JwtAuthModule],
  controllers: [GoogleController],
  providers: [GoogleStrategy],
})
export class GoogleModule {}
