import * as bcrypt from 'bcryptjs';
import { UserEntity } from 'src/user/model/user.entity';

export const userData: Partial<UserEntity>[] = [
  {
    id: '05a92179-6522-4ce7-810d-477b9d7b40e1',
    email: 'admin@chat.local',
    username: 'admin',
    password: bcrypt.hashSync('password', 10),
  },
  {
    id: 'e09ef0f1-fc90-4897-a47c-646484fd664d',
    email: 'habberrih@chat.local',
    username: 'habberrih',
    password: bcrypt.hashSync('password', 10),
  },
  {
    id: 'e366be86-18ce-452e-ba96-aff5cc7c8724',
    email: 'blah@chat.local',
    username: 'blah',
    password: bcrypt.hashSync('password', 10),
  },
  {
    id: '28f5dca6-4190-4eb9-9467-bb70774575c1',
    email: 'ali@chat.local',
    username: 'ali',
    password: bcrypt.hashSync('password', 10),
  },
];
