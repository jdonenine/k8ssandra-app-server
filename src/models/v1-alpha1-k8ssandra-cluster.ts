import {Field, ObjectType} from 'type-graphql';
import {V1ObjectMetadata} from './v1-object-metadata';
import {V1Alpha1K8ssandraClusterStatus} from './v1-alpha1-k8ssandra-cluster-status';

@ObjectType()
export class V1Alpha1K8ssandraCluster {
  @Field()
  apiVersion: string;
  @Field()
  kind: string;
  @Field()
  specJson: string;
  @Field()
  specYaml: string;
  @Field((type) => V1ObjectMetadata)
  metadata: V1ObjectMetadata;
  @Field((type) => V1Alpha1K8ssandraClusterStatus, {nullable: true})
  status?: V1Alpha1K8ssandraClusterStatus;
}
