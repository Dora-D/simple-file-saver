import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.JWT_SECRET));

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('File Management API')
    .setDescription('API documentation for file management system')
    .setVersion('1.0')
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: 'http://localhost:3001/api/auth/google',
            scopes: {
              email: 'Access to your email address',
              profile: 'Access to your profile information',
            },
          },
        },
      },
      'google-oauth2',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      initOAuth: {
        clientId: process.env.OAUTH_GOOGLE_ID,
        usePkceWithAuthorizationCodeGrant: true,
      },
    },
  });

  await app.listen(3001);
}
bootstrap();
