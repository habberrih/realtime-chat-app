import { UserEntity } from 'src/user/model/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'user_id' })
  users: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;
  // PK_c10511130a106802fff8da8afa5
  @UpdateDateColumn()
  updatedAt: Date;
}
