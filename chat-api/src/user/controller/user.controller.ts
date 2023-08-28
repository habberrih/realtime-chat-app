import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user-service/user.service';
import { UserInterface } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/createUser.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserEntity } from '../model/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { LoginResponseInterface } from '../model/login-response.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService
  ) {}

  @UseGuards(JwtAuthGuard)
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
  @Get('/search-username')
  async findAllByUsername(@Query('username') username: string) {
    return this.userService.findAllByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getOneUser(id);
  }

  @Post()
  async httpCreateUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserInterface> {
    const userEntity: UserInterface =
      this.userHelperService.createUserDtoToEntity(createUserDto);
    return this.userService.createUser(userEntity);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<LoginResponseInterface> {
    const loginUserEntity: UserInterface =
      this.userHelperService.loginUserDtoToEntity(loginUserDto);
    const addedUser: UserInterface =
      await this.userService.login(loginUserEntity);

    const loginResponse: LoginResponseInterface = {
      id: addedUser.id,
      username: addedUser.username,
      email: addedUser.email,
      access_token: addedUser.token,
    };

    return loginResponse;
  }
}
