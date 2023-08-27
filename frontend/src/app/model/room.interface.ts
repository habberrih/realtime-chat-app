import { Meta } from './meta.interface';
import { UserInterface } from './user.interface';

export interface RoomInterface {
  id?: string;
  name?: string;
  description?: string;
  users?: UserInterface[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoomPaginateInterface {
  items: RoomInterface[];
  meta: Meta;
}
