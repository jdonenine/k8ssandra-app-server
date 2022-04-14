import {User} from './user';
import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class UserToken {
  @Field()
  token: string;
  @Field((type) => User)
  user: User;
}
