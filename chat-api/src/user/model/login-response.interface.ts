import { UserInterface } from './user.interface';

export interface LoginResponseInterface extends UserInterface {
  access_token: string;
}
