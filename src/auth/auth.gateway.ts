import { CommandBus } from '@nestjs/cqrs';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthorizeSocketCommand } from '@app/authguard';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from '@app/authguard';

@WebSocketGateway({
  namespace: 'auth',
  // path: '/socket',
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})
export class AuthGateway implements OnGatewayDisconnect {
  constructor(private readonly commandBus: CommandBus) {}

  handleDisconnect() {
    // REMOVE FROM ROOMS
    console.log('YEAHHHHHHH');
  }

  @SubscribeMessage('verify-token')
  @UseGuards(WsGuard)
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: string,
  ) {
    const user = await this.commandBus.execute(
      new AuthorizeSocketCommand(body),
    );

    if (!user) {
      socket.disconnect(true);
    }

    return user;
  }
}
