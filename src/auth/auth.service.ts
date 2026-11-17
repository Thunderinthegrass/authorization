import { Injectable } from '@nestjs/common';
import { RegisterDto } from '@/auth/dto/register.dto.js';

@Injectable()
export class AuthService {
  public async register(dto: RegisterDto) {

  }

  public async login() {}

  public async logout() {}

  public async saveSession() {}
}
