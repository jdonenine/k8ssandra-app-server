import {V1Alpha1K8ssandraCluster} from './v1-alpha1-k8ssandra-cluster';
import {Field, ObjectType} from 'type-graphql';

export abstract class V1Alpha1K8ssandraClusterListBase {}

@ObjectType()
export class V1Alpha1K8ssandraClusterList extends V1Alpha1K8ssandraClusterListBase {
  @Field()
  apiVersion: string;
  @Field()
  kind: string;
  @Field((type) => [V1Alpha1K8ssandraCluster])
  items: V1Alpha1K8ssandraCluster[];
}
