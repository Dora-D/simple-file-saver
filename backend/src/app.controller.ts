import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from '@app/app.service';
import { Request } from 'express';
import { GetCurrentUserId } from '@app/common/decprators/get-current-user-id.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  @Get('profile')
  getPrivate(@Req() req: Request, @GetCurrentUserId() userId: number) {
    return userId;
  }
}
