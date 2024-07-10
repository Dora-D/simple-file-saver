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

import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiOAuth2,
} from '@nestjs/swagger';

@ApiTags('Google Authentication')
@Controller('auth/google')
export class GoogleController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Get()
  @UseGuards(GoogleGuard)
  @ApiOAuth2(['profile', 'email'], 'google-oauth2')
  @ApiOperation({ summary: 'Initiate Google authentication' })
  @ApiOkResponse({ description: 'Redirects to Google for authentication' })
  async googleAuth() {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleGuard)
  @ApiOperation({ summary: 'Handle Google authentication callback' })
  @ApiOkResponse({
    description: 'Redirects to main page after successful authentication',
  })
  @ApiBadRequestResponse({ description: 'Bad request if authentication fails' })
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

    const redirectUrl = 'api/swagger';

    return res.redirect(redirectUrl);
  }
}
