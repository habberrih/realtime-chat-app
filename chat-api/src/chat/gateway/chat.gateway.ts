import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: { oriqin: 'https://hoppscotch.io' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('On Connect');
  }

  handleDisconnect(client: any) {
    console.log('On Disconnect');
  }
}
