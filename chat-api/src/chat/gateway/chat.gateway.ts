import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
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
import { PageInterface } from '../model/page.interface';
import { ConnectedUserService } from '../service/connected-user/connected-user.service';
import { ConnectedUserInterface } from '../model/connected-user.interface';

@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:3000',
      'http://localhost:4200',
    ],
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAllConnetections();
  }

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
        console.log(rooms);

        //* subtract page -1 to match the angular material paginator
        rooms.meta.currentPage = rooms.meta.currentPage - 1;

        //* save the socket connection to the database
        await this.connectedUserService.createNewConnection({
          socketId: socket.id,
          user: user,
        });

        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    //* remove connection from the database
    await this.connectedUserService.deleteConnectionBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomInterface) {
    const createdRoom: RoomInterface = await this.roomService.createRoom(
      room,
      socket.data.user.id
    );

    //console.log(createdRoom);

    for (const user of createdRoom.users) {
      const connections: ConnectedUserInterface[] =
        await this.connectedUserService.findByUser(user);
      //console.log(connections);
      const rooms = await this.roomService.getRoomForUser(user.id, {
        page: 1,
        limit: 10,
      });
      for (const connection of connections) {
        this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: PageInterface) {
    page.limit = page.limit > 100 ? 100 : page.limit;

    //* add page +1 to match angular material paginator
    page.page = page.page + 1;

    const rooms = await this.roomService.getRoomForUser(
      socket.data.user.id,
      page
    );

    //* subtract page -1 to match the angular material paginator
    rooms.meta.currentPage = rooms.meta.currentPage - 1;

    return this.server.to(socket.id).emit('rooms', rooms);
  }
}
