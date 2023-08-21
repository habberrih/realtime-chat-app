import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserEntity } from '../../model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from 'src/user/model/user.interface';

import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) {}

  async login(user: UserInterface): Promise<UserInterface> {
    const userExists = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await this.authService.comparePasswords(
      user.password,
      userExists.password
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const foundUser: UserInterface = await this.userRepository.findOne({
      where: { id: userExists.id },
    });

    const token: string = await this.authService.generateJwtToken(foundUser);
    foundUser.token = token;
    return foundUser;
  }

  async getAllUsers(
    options: IPaginationOptions
  ): Promise<Pagination<UserInterface>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  async createUser(newUser: UserInterface): Promise<UserEntity> {
    const emailExists = await this.userRepository.findOne({
      where: {
        email: newUser.email,
      },
    });
    const UsernameExists = await this.userRepository.findOne({
      where: {
        username: newUser.username,
      },
    });

    if (emailExists || UsernameExists) {
      throw new ConflictException('Email or Username already exists');
    }
    newUser.password = await this.authService.hashPassword(newUser.password);

    const addedUser = this.userRepository.create(newUser);
    await this.userRepository.save(addedUser);
    delete addedUser.password;
    return addedUser;
  }
}
