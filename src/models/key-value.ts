import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class KeyValue {
  @Field()
  key: string;
  @Field({nullable: true})
  value?: string;

  constructor(key: string, value?: string) {
    this.key = key;
    this.value = value;
  }
}
