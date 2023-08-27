import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserInterface } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import { RoomService } from '../service/room-service/room.service';
import { RoomInterface } from '../model/room.interface';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:3000',
      'http://localhost:4200',
    ],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService
  ) {}

  async handleConnection(socket: Socket) {
    try {
      console.log('Connection established');
      const decodedToken = await this.authService.verifyJwtToken(
        socket.handshake.headers.authorization
      );
      const user: UserInterface = await this.userService.getOneUser(
        decodedToken.user.id
      );

      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;

        const rooms = await this.roomService.getRoomForUser(user.id, {
          page: 1,
          limit: 10,
        });
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(
    socket: Socket,
    room: RoomInterface
  ): Promise<RoomInterface> {
    return await this.roomService.createRoom(room, socket.data.user.id);
  }
}
