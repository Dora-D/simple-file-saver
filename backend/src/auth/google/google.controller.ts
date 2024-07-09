import { JwtAuthService } from '@app/auth/jwt/jwt-auth.service';
import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
// import { SESSION_COOKIE_KEY } from '@app/config/constants';
import { GoogleGuard } from '@app/auth/google/google.guard';
import { User } from '@app/entities/user.entity';
import { SESSION_COOKIE_KEY } from '@app/config/constants';

@Controller('auth/google')
export class GoogleController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Get()
  @UseGuards(GoogleGuard)
  async googleAuth() {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user;

    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const { accessToken } = this.jwtAuthService.login(user as User);

    res.cookie(SESSION_COOKIE_KEY, accessToken, {
      secure: process.env.NODE_ENV === 'production' || undefined,
      httpOnly: true,
      signed: process.env.NODE_ENV === 'production' || undefined,
      //   sameSite: 'lax',
    });

    return res.redirect('/api/profile');
  }
}
