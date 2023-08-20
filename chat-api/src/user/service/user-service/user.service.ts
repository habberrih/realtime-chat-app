import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../../model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInterface } from 'src/user/model/user.interface';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  createUser(newUser: UserInterface): Observable<UserInterface> {
    return this.IsEmailExists(newUser.email).pipe(
      switchMap((exists: boolean) => {
        if (exists === true) {
          return this.hashPassword(newUser.password).pipe(
            switchMap((hashedPassword: string) => {
              return from(
                this.userRepository.save({
                  username: newUser.username,
                  email: newUser.email,
                  password: hashedPassword,
                })
              ).pipe(switchMap((user: UserInterface) => this.findOne(user.id)));
            })
          );
        } else {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
      })
    );
  }

  private hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  private findOne(id: number): Observable<UserInterface> {
    return from(this.userRepository.findOne({ where: { id } }));
  }
  private IsEmailExists(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      map((user: UserInterface) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
