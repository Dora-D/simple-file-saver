import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SESSION_COOKIE_KEY } from '@app/config/constants';

export type JwtPayload = { sub: number; username: string };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const extractJwtFromCookie = (req: Request) => {
      let token = null;
      const isProduction = process.env.NODE_ENV === 'production';

      if (req) {
        if (isProduction && req.signedCookies) {
          token = req.signedCookies[SESSION_COOKIE_KEY];
        } else if (req.cookies) {
          token = req.cookies[SESSION_COOKIE_KEY];
        }
      }
      console.log(req.cookies);

      return token;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
