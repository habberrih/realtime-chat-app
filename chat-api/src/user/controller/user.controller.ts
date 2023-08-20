import { Body, Controller, Post, Get, Patch, Param } from '@nestjs/common';
import { UserService } from '../service/user-service/user.service';
import { Observable, of, switchMap } from 'rxjs';
import { UserInterface } from '../model/user.interface';
import { CreateUserDto } from '../model/dto/createUser.dto';
import { log } from 'util';
import { UserHelperService } from '../service/user-helper/user-helper.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService
  ) {}

  @Get()
  getAllUsers() {
    // return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    // return this.userService.getUserById(id);
  }

  @Post()
  httpCreateUser(
    @Body() createUserDto: CreateUserDto
  ): Observable<UserInterface> {
    return this.userHelperService
      .createUserDtoToEntity(createUserDto)
      .pipe(
        switchMap((user: UserInterface) => this.userService.createUser(user))
      );
  }

  @Post()
  login() {}
}
