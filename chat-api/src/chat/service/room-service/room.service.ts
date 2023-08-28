import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/chat/model/room.entity';
import { RoomInterface } from 'src/chat/model/room.interface';
import { UserInterface } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    private userService: UserService
  ) {}

  async createRoom(
    room: RoomInterface,
    creator: UserInterface
  ): Promise<RoomInterface> {
    room.users.push(creator);

    return this.roomRepository.save(room);
  }

  async getRoomForUser(
    userId: string,
    options: IPaginationOptions
  ): Promise<Pagination<RoomInterface>> {
    const query = this.roomRepository
      .createQueryBuilder('rooms')
      .leftJoin('rooms.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('rooms.users', 'all_users')
      .orderBy('rooms.updatedAt', 'DESC');

    return paginate(query, options);
  }
}
