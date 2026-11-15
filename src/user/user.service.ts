//NestJS создаст папку src/auth и автоматически добавит AuthModule в ваш AppModule. Внутри будет 3 главных файла:
//
// auth.module.ts: Связывает контроллер и сервис вместе.
//
// auth.controller.ts: Здесь будут ваши эндпоинты (например, POST /auth/register и POST /auth/login). Он будет принимать HTTP-запросы.
//
// auth.service.ts: Здесь будет «мозг» — бизнес-логика. Контроллер будет передавать данные сюда, а сервис будет хешировать пароли, обращаться к базе через PrismaService и т.д.
//
// (Также команда может создать пустые папки dto и entities. Если папки dto нет — просто создайте её вручную, так как туда мы положим RegisterDto и LoginDto).

import { Injectable, NotFoundException } from '@nestjs/common';
import {PrismaService} from '@/prisma/prisma.service.js';
import { AuthMethod } from '@/generated/prisma/enums.js';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      },
      include: {
        accounts: true
      }
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден, проверьте введенные данные')
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email
      },
      include: {
        accounts: true
      }
    })

    return user;
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    picture: string,
    method: AuthMethod,
    isVerified: boolean,
  ) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: password ? await hash(password) : '',
        displayName,
        picture,
        method,
        isVerified,
      },
      include: {
        accounts: true
      }
    })
    return user;
  }
}


// вариант 2:

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '@/prisma/prisma.service.js';
// import { AuthMethod } from '@/generated/prisma/enums.js';
//
// interface CreateUserParams {
//   email: string;
//   password?: string; // Уже захешированный!
//   displayName: string;
//   picture?: string;
//   method: AuthMethod;
//   isVerified: boolean;
// }
//
// @Injectable()
// export class UserService {
//   public constructor(private readonly prisma: PrismaService) {}
//
//   public async findById(id: string) {
//     const user = await this.prisma.user.findUnique({
//       where: { id },
//       include: { accounts: true },
//     });
//
//     if (!user) {
//       throw new NotFoundException('Пользователь не найден');
//     }
//     return user;
//   }
//
//   public async findByEmail(email: string) {
//     return this.prisma.user.findUnique({
//       where: { email },
//       include: { accounts: true },
//     });
//   }
//
//   public async create(data: CreateUserParams) {
//     return this.prisma.user.create({
//       data: {
//         email: data.email,
//         password: data.password ?? null,
//         displayName: data.displayName,
//         picture: data.picture ?? null,
//         method: data.method, // <--- Теперь это поле на месте
//         isVerified: data.isVerified,
//       },
//       include: { accounts: true },
//     });
//   }
// }
