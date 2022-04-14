import {Arg, Ctx, Mutation, Resolver, UnauthorizedError} from 'type-graphql';
import {UserToken} from '../models/user-token';
import {LOCAL_USER_SERVICE} from '../services/local-user.service';
import {compare} from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import {APP_SECRET, APP_TOKEN_EXPIRE_HOURS} from '../index';
import {Context} from '../auth/context.interface';

@Resolver()
export class AuthResolver {
  @Mutation((type) => UserToken)
  async login(@Arg('id') id: string, @Arg('password') password: string, @Ctx() ctx: Context): Promise<UserToken> {
    const user = await LOCAL_USER_SERVICE.getUser(id);
    if (!user) {
      throw new UnauthorizedError();
    }
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedError();
    }
    const token = sign(user, APP_SECRET, {
      expiresIn: APP_TOKEN_EXPIRE_HOURS + 'h',
    });
    return Promise.resolve({
      token: token,
      user: user,
    } as UserToken);
  }
}
