import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/user-service/user.service';
import { UserInterface } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/createUser.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserEntity } from '../model/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService
  ) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<Pagination<UserInterface>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.getAllUsers({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    // return this.userService.getUserById(id);
  }

  @Post()
  async httpCreateUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    const userEntity: UserInterface =
      this.userHelperService.createUserDtoToEntity(createUserDto);
    return this.userService.createUser(userEntity);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<boolean> {
    const loginUserEntity: UserInterface =
      this.userHelperService.loginUserDtoToEntity(loginUserDto);
    return this.userService.login(loginUserEntity);
  }
}
