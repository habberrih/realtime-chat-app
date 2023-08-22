import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserInterface } from 'src/user/model/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwtToken(user: UserInterface): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async verifyJwtToken(jwtToken: string): Promise<any> {
    return this.jwtService.verifyAsync(jwtToken);
  }
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
