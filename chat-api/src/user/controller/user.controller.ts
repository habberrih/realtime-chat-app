import { Body, Controller, Post, Get, Patch, Param } from '@nestjs/common';
import { UserService } from '../service/user-service/user.service';
import { UserInterface } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/createUser.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserEntity } from '../model/user.entity';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService
  ) {}

  // @Get()
  // getAllUsers() {
  //   return this.userService.getAllUsers();
  // }

  @Get(':id')
  getUserById(@Param('id') id: number) {
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

  @Post()
  login() {}
}
