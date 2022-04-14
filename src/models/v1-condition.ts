import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class V1Condition {
  @Field()
  lastTransitionTime: string;
  @Field()
  status: string;
  @Field()
  type: string;
}
