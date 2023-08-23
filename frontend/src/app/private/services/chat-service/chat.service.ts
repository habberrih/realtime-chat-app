import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  async sendMessage() {}

  async getMessages() {
    return this.socket.fromEvent('message');
  }
}
