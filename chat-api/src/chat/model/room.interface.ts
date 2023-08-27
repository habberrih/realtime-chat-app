import { UserInterface } from 'src/user/model/user.interface';

export interface RoomInterface {
  id?: string;
  name?: string;
  description?: string;
  users?: UserInterface[];
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
