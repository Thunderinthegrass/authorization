import { ConflictException, Injectable } from '@nestjs/common'
import { RegisterDto } from '@/auth/dto/register.dto.js';
import { UserService } from '@/user/user.service.js'
import { AuthMethod } from '@/generated/prisma/enums.js'

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UserService) {}

  public async register(dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists) {
      throw new ConflictException(
        'Регистрация не удалась. Пользователь с таким email уже существует. Пожалуйста, используйте другой email, или войдите в систему.'
      )
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false
    )

    return newUser
  }

  public async login() {}

  public async logout() {}

  public async saveSession() {}
}
