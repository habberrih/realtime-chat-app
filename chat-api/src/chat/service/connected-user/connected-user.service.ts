import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedUserEntity } from 'src/chat/model/connected-user.entity';
import { ConnectedUserInterface } from 'src/chat/model/connected-user.interface';
import { UserInterface } from 'src/user/model/user.interface';
@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>
  ) {}

  async createNewConnection(
    connectedUser: ConnectedUserInterface
  ): Promise<ConnectedUserInterface> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: UserInterface): Promise<ConnectedUserInterface[]> {
    return this.connectedUserRepository.find({ where: { user } });
  }

  async deleteConnectionBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }
}
