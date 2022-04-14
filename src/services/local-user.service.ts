import {User} from '../models/user';
import {hash} from 'bcryptjs';
import {UserServiceInterface} from './user.service.interface';

export class LocalUserService implements UserServiceInterface {
  users: any = {};

  async addUser(id: string, password: string, roles: string[]): Promise<User> {
    if (id.length < 1) {
      throw new Error('Invalid id provided, must not be empty');
    }
    if (password.length < 1) {
      throw new Error('Invalid password provided, must not be empty');
    }
    const existingUser = await this.getUser(id);
    if (existingUser) {
      throw new Error('Invalid id provided, must be unique');
    }
    const encryptedPassword = await hash(password, 10);
    const user = {
      id: id,
      password: encryptedPassword,
      roles: roles || [],
    } as unknown as User;
    this.users[user.id] = user;
    return Promise.resolve(user);
  }

  async getUsers(): Promise<User[]> {
    return Promise.resolve(Object.values(this.users));
  }

  async getUser(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users[id]);
  }

  async deleteUser(id: string): Promise<User> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      throw new Error('No user with that id exists');
    }
    delete this.users[id];
    return Promise.resolve(existingUser);
  }
}

export const LOCAL_USER_SERVICE = new LocalUserService();
