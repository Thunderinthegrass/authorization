// Это корневой модуль приложения (AppModule). Это «главный щиток управления» или «скелет», к которому будут подключаться все остальные части бэкенда (база данных, контроллеры, сервисы, настройки).

import { Module } from '@nestjs/common';
import { IS_DEV_ENV } from '@/libs/common/utils/is-dev.utils.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [//Массив imports (список того, что использует этот модуль)
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }), PrismaModule, AuthModule, UserModule,
  ],
})
export class AppModule {}
