import { RoomEntity } from 'src/chat/model/room.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];
  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
