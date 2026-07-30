import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(username: string, password: string): Promise<{ access_token: string; username: string }> {
    const adminUser = this.configService.get<string>('ADMIN_USERNAME', 'admin');
    const adminPass = this.configService.get<string>('ADMIN_PASSWORD', 'hookahlab2024');

    if (username !== adminUser || password !== adminPass) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    const payload = { sub: 'admin', username: adminUser };
    const access_token = this.jwtService.sign(payload);

    return { access_token, username: adminUser };
  }

  verifyToken(token: string): { sub: string; username: string } {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş token');
    }
  }
}
