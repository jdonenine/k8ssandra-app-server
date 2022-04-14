import {Field, ID, Int, ObjectType} from 'type-graphql';
import {V1Condition} from './v1-condition';

@ObjectType()
export class V1Alpha1K8ssandraClusterStatusCondition extends V1Condition {
  @Field({nullable: true})
  message?: string;
  @Field({nullable: true})
  reason?: string;
}

@ObjectType()
export class V1Alpha1K8ssandraClusterStatusDatacenterCassandraNodeStatus {
  @Field()
  nodeName: string;
  @Field()
  hostId: string;
}

@ObjectType()
export class V1Alpha1K8ssandraClusterStatusDatacenterCassandra {
  @Field()
  cassandraOperatorProgress: string;
  @Field((type) => [V1Alpha1K8ssandraClusterStatusCondition], {nullable: true})
  conditions?: V1Alpha1K8ssandraClusterStatusCondition[];
  @Field({nullable: true})
  lastServerNodeStarted?: string;
  @Field((type) => [V1Alpha1K8ssandraClusterStatusDatacenterCassandraNodeStatus], {nullable: true})
  nodeStatuses?: V1Alpha1K8ssandraClusterStatusDatacenterCassandraNodeStatus[];
  @Field((type) => Int, {nullable: true})
  observedGeneration?: number;
}

@ObjectType()
export class V1Alpha1K8ssandraClusterStatusDatacenterStargate {
  @Field((type) => [V1Alpha1K8ssandraClusterStatusCondition], {nullable: true})
  conditions?: V1Alpha1K8ssandraClusterStatusCondition[];
  @Field((type) => Int)
  availableReplicas: number;
  @Field((type) => [String], {nullable: true})
  deploymentRefs?: string[];
  @Field()
  progress: string;
  @Field((type) => Int)
  readyReplicas: number;
  @Field()
  readyReplicasRatio: string;
  @Field((type) => Int)
  replicas: number;
  @Field()
  serviceRef: string;
  @Field((type) => Int)
  updatedReplicas: number;
}

@ObjectType()
export class V1Alpha1K8ssandraClusterStatusDatacenter {
  @Field((type) => ID)
  name: string;
  @Field((type) => V1Alpha1K8ssandraClusterStatusDatacenterCassandra, {
    nullable: true,
  })
  cassandra?: V1Alpha1K8ssandraClusterStatusDatacenterCassandra;
  @Field((type) => V1Alpha1K8ssandraClusterStatusDatacenterStargate, {
    nullable: true,
  })
  stargate?: V1Alpha1K8ssandraClusterStatusDatacenterStargate;
}

@ObjectType()
export class V1Alpha1K8ssandraClusterStatus {
  @Field((type) => [V1Condition], {nullable: true})
  conditions?: V1Condition[];
  @Field((type) => [V1Alpha1K8ssandraClusterStatusDatacenter], {nullable: true})
  datacenters?: V1Alpha1K8ssandraClusterStatusDatacenter[];
}
