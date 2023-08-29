import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import {
  RoomInterface,
  RoomPaginateInterface,
} from 'src/app/model/room.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket, private snackBar: MatSnackBar) {}

  sendMessage() {}

  getMessages() {
    return this.socket.fromEvent('message');
  }

  getMyRooms(): Observable<RoomPaginateInterface> {
    return this.socket.fromEvent<RoomPaginateInterface>('rooms');
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', { limit, page });
  }

  createRoom(room: RoomInterface) {
    this.socket.emit('createRoom', room);
    this.snackBar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
