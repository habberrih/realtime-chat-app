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

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', { limit, page });
  }

  createRoom() {
    // this.socket.emit('createRoom', room);
  }
}
