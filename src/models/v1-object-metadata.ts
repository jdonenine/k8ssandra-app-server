import {Field, ID, Int, ObjectType} from 'type-graphql';
import {KeyValue} from './key-value';

@ObjectType()
export class V1ObjectMetadata {
  @Field((type) => [KeyValue], {nullable: true})
  annotations?: KeyValue[];
  @Field({nullable: true})
  creationTimestamp?: string;
  @Field((type) => [String], {nullable: true})
  finalizers?: string[];
  @Field((type) => Int, {nullable: true})
  generation?: number;
  @Field({nullable: true})
  name: string;
  @Field()
  namespace: string;
  @Field({nullable: true})
  resourceVersion: string;
  @Field((type) => ID, {nullable: true})
  uid: string;
}
