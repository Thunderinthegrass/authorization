//bun run start:dev

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';//NestFactory — главный инструмент NestJS, который умеет создавать экземпляры приложений.
import { AppModule } from './app.module.js';//AppModule — корневой модуль вашего приложения (тот самый, где подключаются контроллеры, сервисы и база данных). ObserveInstrument — инструмент из модуля наблюдаемости @nestjs/observe, который был подключен ранее, он нужен для сбора логов и метрик.

import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService)

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
await bootstrap();
