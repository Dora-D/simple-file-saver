import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('File Management API')
    .setDescription('API documentation for file management system')
    .setVersion('1.0')
    // .addBearerAuth() // If you're using JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.setGlobalPrefix('api');
  app.use(cookieParser(process.env.JWT_SECRET));

  await app.listen(3001);
}
bootstrap();
