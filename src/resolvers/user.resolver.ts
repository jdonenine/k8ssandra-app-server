import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {Context} from '../auth/context.interface';
import {LOCAL_USER_SERVICE} from '../services/local-user.service';
import {User} from '../models/user';
import {ROLE_USERS_CREATE, ROLE_USERS_DELETE, ROLE_USERS_READ_ALL, ROLES_DEFAULT} from '../auth/roles';
import {AuthenticationError, UserInputError} from 'apollo-server';

@Resolver()
export class UserResolver {
  @Authorized(ROLE_USERS_READ_ALL)
  @Query((type) => [User])
  async getAllUsers(): Promise<User[]> {
    return LOCAL_USER_SERVICE.getUsers();
  }

  @Authorized(ROLE_USERS_READ_ALL)
  @Query((type) => User)
  async getUser(@Arg('id') id: string): Promise<User | undefined> {
    if (!id?.length) {
      throw new UserInputError('A valid id is required');
    }
    return LOCAL_USER_SERVICE.getUser(id);
  }

  @Authorized()
  @Query((type) => User)
  async getCurrentUser(@Ctx() context: Context): Promise<User | undefined> {
    if (!context.user) {
      throw new AuthenticationError('No authenticated user present');
    }
    return LOCAL_USER_SERVICE.getUser(context.user.id);
  }

  @Authorized(ROLE_USERS_CREATE)
  @Mutation((type) => User)
  async createUser(
    @Arg('id') id: string,
    @Arg('password') password: string,
    @Arg('roles', (type) => [String], {nullable: true}) roles?: string[],
  ): Promise<User> {
    if (!id?.length) {
      throw new UserInputError('A valid id is required');
    }
    if (!password?.length) {
      throw new UserInputError('A valid password is required');
    }
    const existingUser = await LOCAL_USER_SERVICE.getUser(id.trim());
    if (existingUser) {
      throw new UserInputError('A user with that id already exists');
    }
    const userRoles = ROLES_DEFAULT;
    if (roles) {
      userRoles.concat(roles);
    }
    const uniqueRoles = Array.from(new Set<string>(userRoles));
    return LOCAL_USER_SERVICE.addUser(id.trim(), password.trim(), uniqueRoles);
  }

  @Authorized(ROLE_USERS_DELETE)
  @Mutation((type) => User)
  async deleteUser(@Arg('id') id: string): Promise<User> {
    if (!id?.length) {
      throw new UserInputError('A valid id is required');
    }
    const existingUser = await LOCAL_USER_SERVICE.getUser(id.trim());
    if (!existingUser) {
      throw new UserInputError('No user with that id exists');
    }
    return LOCAL_USER_SERVICE.deleteUser(id.trim());
  }
}
