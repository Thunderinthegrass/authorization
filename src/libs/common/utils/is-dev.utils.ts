//проверка, где запускается приложение. ConfigService — это специальный встроенный сервис в NestJS (который поставляется пакетом @nestjs/config), предназначенный для безопасной и удобной работы с переменными окружения (из файла .env).
// Если объяснять простыми словами: это ваш «умный пульт управления» настройками приложения.
// Можно было бы везде писать process.env.NODE_ENV или process.env.APPLICATION_PORT, но профессиональные NestJS-разработчики используют ConfigService. Вот почему он лучше обычного process.env:

import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv'

dotenv.config()

export const isDev = (configService: ConfigService) =>
  configService.getOrThrow('NODE_ENV') === 'development'

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'