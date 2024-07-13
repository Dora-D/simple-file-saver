import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { name, emails } = profile;
    let user;

    if (emails && emails[0].value)
      user = await this.usersService.findOneByEmail(emails[0].value);

    if (!user && name && emails) {
      user = await this.usersService.create({
        name: name.givenName,
        email: emails[0].value,
      });
    }

    return user;
  }
}
