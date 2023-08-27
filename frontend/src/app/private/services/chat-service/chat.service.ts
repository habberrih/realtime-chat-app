import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import {
  RoomInterface,
  RoomPaginateInterface,
} from 'src/app/model/room.interface';
import { UserInterface } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket) {}

  sendMessage() {}

  getMessages() {
    return this.socket.fromEvent('message');
  }

  getMyRooms() {
    return this.socket.fromEvent<RoomPaginateInterface>('rooms');
  }

  createRoom() {
    const user2: UserInterface = {
      id: 'a2aabe55-d56f-4209-83e2-351f2d3ac36d',
    };
    const room: RoomInterface = {
      name: 'room1',
      users: [user2],
    };

    this.socket.emit('createRoom', room);
  }
}
