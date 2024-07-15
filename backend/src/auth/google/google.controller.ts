import { UsersService } from '@app/users/users.service';
import { JwtAuthService } from '@app/auth/jwt/jwt-auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
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
  ApiBadRequestResponse,
  ApiExcludeEndpoint,
  ApiCreatedResponse,
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
  @ApiExcludeEndpoint()
  async googleAuth() {
    // Guard redirects
  }

  @Post('/login')
  @ApiCreatedResponse({ description: 'User successfully logged in.' })
  @ApiBadRequestResponse({ description: 'Invalid or missing token.' })
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
    const picture = userPayload.picture;

    let user = await this.usersService.findOneByEmail(email);

    if (!user) {
      user = await this.usersService.create({ name, email, picture });
    }

    const { accessToken } = this.jwtAuthService.login(user);

    res.cookie(SESSION_COOKIE_KEY, accessToken, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      signed: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production',
    });

    return res.status(HttpStatus.CREATED).json(user);
  }

  @Get('redirect')
  @UseGuards(GoogleGuard)
  @ApiExcludeEndpoint()
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

    const redirectUrl = 'http://localhost:3001/api/swagger';

    return res.redirect(redirectUrl);
  }
}
