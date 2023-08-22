import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { UserInterface } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';

export interface RequestModel extends Request {
  currentUser: UserInterface;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authSevice: AuthService,
    private userService: UserService
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
      const token: string = req.headers['authorization'].split(' ')[1];
      const decodedToken = await this.authSevice.verifyJwtToken(token);

      const user: UserInterface = await this.userService.getOneUser(
        decodedToken.user.id
      );

      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }
      req.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        // role: decodedToken.role,
      };
      next();
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
