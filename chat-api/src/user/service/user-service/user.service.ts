import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserEntity } from '../../model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from 'src/user/model/user.interface';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  // async createUser(user: UserInterface): Promise<UserInterface> {
  //   return this.userRepository.create(user);
  // }

  async getAllUsers(): Promise<any> {
    // return await this.userRepository.find({});
  }

  async createUser(newUser: UserInterface): Promise<UserEntity> {
    const isEmailExists = async () => {
      const is = await this.userRepository.findOne({
        where: {
          email: newUser.email,
        },
      });
      if (is) return true;
      return false;
    };
    const isUsernameExists = async () => {
      const is = await this.userRepository.findOne({
        where: {
          username: newUser.username,
        },
      });
      if (is) return true;
      return false;
    };

    if ((await isEmailExists()) || (await isUsernameExists())) {
      throw new ConflictException('Email or Username already exists');
    }
    newUser.password = await bcrypt.hash(newUser.password, 12);

    const addedUser = this.userRepository.create(newUser);
    return this.userRepository.save(addedUser);
  }
}
