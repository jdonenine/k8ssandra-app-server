import {User} from '../models/user';

export interface UserServiceInterface {
  addUser(id: string, password: string, roles: string[]): Promise<User>;
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  deleteUser(id: string): Promise<User>;
}
