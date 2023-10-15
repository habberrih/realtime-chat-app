import { UserEntity } from 'src/user/model/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('conncted_user')
export class ConnectedUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, (user) => user.connections)
  @JoinColumn()
  user: UserEntity;
}
