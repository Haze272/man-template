import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log(process.env.DATABASE_HOST ?? 'NO DB HOST');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
  });
  app.setGlobalPrefix(process.env.APP_API_URL ?? 'api/v1');
  app.use(cookieParser());
  await app.listen(parseInt(process.env.APP_PORT ?? 'api/v1'));
}
bootstrap();
