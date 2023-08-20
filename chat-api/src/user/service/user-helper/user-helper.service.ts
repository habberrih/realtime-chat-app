import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from 'src/user/model/dto/createUser.dto';
import { LoginUserDto } from 'src/user/model/dto/login-user.dto';
import { UserInterface } from 'src/user/model/user.interface';

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(
    createUserDto: CreateUserDto
  ): Observable<UserInterface> {
    return of({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    });
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<UserInterface> {
    return of({
      email: loginUserDto.email,
      password: loginUserDto.password,
    });
  }
}
