//bun run start:dev

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';//NestFactory — главный инструмент NestJS, который умеет создавать экземпляры приложений.
import { AppModule } from './app.module.js';//AppModule — корневой модуль вашего приложения (тот самый, где подключаются контроллеры, сервисы и база данных). ObserveInstrument — инструмент из модуля наблюдаемости @nestjs/observe, который был подключен ранее, он нужен для сбора логов и метрик.
import { Redis } from 'ioredis';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session'
import { ms, StringValue } from '@/libs/common/utils/ms.utils.js'
import { parseBoolean } from '@/libs/common/utils/parse-boolean.util.js'
import { RedisStore } from 'connect-redis'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService)
  const redis = new Redis(config.getOrThrow('REDIS_URI'))

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),//секретный ключ для подписи куки, чтобы её нельзя было подделать
      name: config.getOrThrow<string>('SESSION_NAME'),//имя куки в браузере (у нас session)
      resave: false,//Заставляет сессию пересохраняться при каждом запросе, даже если она не менялась. Для Redis обычно ставят false, чтобы не нагружать базу лишними записями
      saveUninitialized: false,// Настройка, запрещающая создавать пустые сессии для незалогиненных пользователей. Сохраняет место в базе и спасает от проблем с GDPR (закон о куках).
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),//Для какого домена действует кука
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),//Время жизни (используется утилита ms(), чтобы превратить '30d' из .env в миллисекунды).
        httpOnly: parseBoolean(//Через утилиту parseBoolean запрещает JS на фронтенде читать куку. Защита от XSS-атак.
          config.getOrThrow<string>('SESSION_HTTP_ONLY')
        ),
        secure: parseBoolean(//(через parseBoolean) Если true, кука передается только по HTTPS (для локалки должно быть false).
          config.getOrThrow<string>('SESSION_SECURE')
        ),
        sameSite: 'lax'//настройка для безопасности (защита от CSRF-атак).
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow<string>('SESSION_FOLDER')
      }),
    })
  )

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
await bootstrap();
