import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';

import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  constructor() {
    // Берем POSTGRES_URI вместо DATABASE_URL
    const connectionString = process.env.POSTGRES_URI;

    if (!connectionString) {
      throw new Error('Критическая ошибка: POSTGRES_URI не найден в .env файле');
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect()
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
  }
}
