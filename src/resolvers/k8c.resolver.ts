import {Arg, Authorized, Query, Resolver} from 'type-graphql';
import {ROLE_K8C_READ} from '../auth/roles';
import {V1Alpha1K8ssandraClusterList} from '../models/v1-alpha1-k8ssandra-cluster-list';
import {K8C_SERVICE} from '../services/k8c.service';

@Resolver()
export class K8cResolver {
  @Authorized(ROLE_K8C_READ)
  @Query((type) => V1Alpha1K8ssandraClusterList)
  async getK8cs(
    @Arg('context') context: string,
    @Arg('namespace') namespace: string,
  ): Promise<V1Alpha1K8ssandraClusterList> {
    return K8C_SERVICE.getK8cs(context, namespace);
  }
}
