import { UsersService } from '@app/users/users.service';
import { JwtAuthService } from '@app/auth/jwt/jwt-auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@ApiTags('Google Authentication')
@Controller('auth/google')
export class GoogleController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(GoogleGuard)
  @ApiOAuth2(['profile', 'email'], 'google-oauth2')
  @ApiOperation({ summary: 'Initiate Google authentication' })
  @ApiOkResponse({ description: 'Redirects to Google for authentication' })
  async googleAuth() {
    // Guard redirects
  }

  @Post('/login')
  async login(@Body('token') token: string, @Res() res: Response) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const userPayload = ticket.getPayload();

    if (!userPayload) {
      throw new BadRequestException('Unauthenticated');
    }

    const email = userPayload.email as string;
    const name = (userPayload?.name || userPayload?.given_name) as string;

    let user = await this.usersService.findOneByEmail(email);

    if (!user) {
      user = await this.usersService.create({ name, email });
    }

    const { accessToken } = this.jwtAuthService.login(user);

    res.cookie(SESSION_COOKIE_KEY, accessToken, {
      secure: process.env.NODE_ENV === 'production' || undefined,
      httpOnly: true,
      signed: process.env.NODE_ENV === 'production' || undefined,
    });

    return res.send(user);
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
    });

    const redirectUrl = 'api/swagger';

    return res.redirect(redirectUrl);
  }
}
