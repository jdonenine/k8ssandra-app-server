import {V1Alpha1K8ssandraClusterList} from '../models/v1-alpha1-k8ssandra-cluster-list';
import {getKubeConfigForContext} from './k8s.utils';
import {CustomObjectsApi} from '@kubernetes/client-node';
import {V1Alpha1K8ssandraCluster} from '../models/v1-alpha1-k8ssandra-cluster';
import {V1ObjectMetadata} from '../models/v1-object-metadata';
import {KeyValue} from '../models/key-value';
import {Document} from 'yaml';
import {
  V1Alpha1K8ssandraClusterStatus,
  V1Alpha1K8ssandraClusterStatusDatacenter,
  V1Alpha1K8ssandraClusterStatusDatacenterCassandra,
  V1Alpha1K8ssandraClusterStatusDatacenterCassandraNodeStatus,
  V1Alpha1K8ssandraClusterStatusDatacenterStargate,
} from '../models/v1-alpha1-k8ssandra-cluster-status';

export class K8cService {
  async getK8cs(context: string, namespace: string): Promise<V1Alpha1K8ssandraClusterList> {
    const kc = getKubeConfigForContext(context);
    const k8sApi = kc.makeApiClient(CustomObjectsApi);
    const response = await k8sApi.listNamespacedCustomObject(
      'k8ssandra.io',
      'v1alpha1',
      namespace?.trim(),
      'k8ssandraclusters',
    );
    return Promise.resolve(this.buildV1Alpha1K8ssandraClusterList(response.body));
  }

  private buildV1Alpha1K8ssandraClusterList(apiData: any): V1Alpha1K8ssandraClusterList {
    const k8cList = new V1Alpha1K8ssandraClusterList();
    Object.assign(k8cList, apiData);
    k8cList.items = apiData.items?.map((item) => this.buildV1Alpha1K8ssandraCluster(item));
    return k8cList;
  }

  private buildV1Alpha1K8ssandraCluster(apiData: any): V1Alpha1K8ssandraCluster {
    const k8c = new V1Alpha1K8ssandraCluster();

    k8c.apiVersion = apiData.apiVersion;

    k8c.kind = apiData.kind;

    k8c.metadata = this.buildV1ObjectMetadata(apiData.metadata);

    k8c.status = this.buildV1Alpha1K8ssandraClusterStatus(apiData.status);

    k8c.specJson = JSON.stringify(apiData.spec);

    k8c.specYaml = new Document(apiData.spec).toString();

    return k8c;
  }

  private buildV1ObjectMetadata(apiDataMetadata: any): V1ObjectMetadata {
    const metadata = new V1ObjectMetadata();
    if (!apiDataMetadata) {
      return metadata;
    }
    Object.assign(metadata, apiDataMetadata);
    if (apiDataMetadata.annotations) {
      const annotations: KeyValue[] = [];
      for (let key in apiDataMetadata.annotations) {
        const keyValue = new KeyValue(key, apiDataMetadata.annotations[key]);
        annotations.push(keyValue);
      }
      metadata.annotations = annotations;
    }
    return metadata;
  }

  private buildV1Alpha1K8ssandraClusterStatus(apiDataStatus: any): V1Alpha1K8ssandraClusterStatus {
    const status = new V1Alpha1K8ssandraClusterStatus();
    if (!apiDataStatus) {
      return status;
    }
    Object.assign(status, apiDataStatus);
    if (apiDataStatus.datacenters) {
      const datacenters: V1Alpha1K8ssandraClusterStatusDatacenter[] = [];
      for (let datacenterName in apiDataStatus.datacenters) {
        const datacenter = new V1Alpha1K8ssandraClusterStatusDatacenter();
        datacenter.name = datacenterName;
        if (apiDataStatus.datacenters[datacenterName].cassandra) {
          datacenter.cassandra = new V1Alpha1K8ssandraClusterStatusDatacenterCassandra();
          Object.assign(datacenter.cassandra, apiDataStatus.datacenters[datacenterName].cassandra);
          if (apiDataStatus.datacenters[datacenterName].cassandra.nodeStatuses) {
            const nodeStatuses: V1Alpha1K8ssandraClusterStatusDatacenterCassandraNodeStatus[] = [];
            for (let node in apiDataStatus.datacenters[datacenterName].cassandra.nodeStatuses) {
              const nodeStatus = new V1Alpha1K8ssandraClusterStatusDatacenterCassandraNodeStatus();
              nodeStatus.nodeName = node;
              nodeStatus.hostId = apiDataStatus.datacenters[datacenterName].cassandra.nodeStatuses[node].hostID;
              nodeStatuses.push(nodeStatus);
            }
            datacenter.cassandra.nodeStatuses = nodeStatuses;
          }
        }
        if (apiDataStatus.datacenters[datacenterName].stargate) {
          datacenter.stargate = new V1Alpha1K8ssandraClusterStatusDatacenterStargate();
          Object.assign(datacenter.stargate, apiDataStatus.datacenters[datacenterName].stargate);
        }
        datacenters.push(datacenter);
      }
      status.datacenters = datacenters;
    }
    return status;
  }
}

export const K8C_SERVICE = new K8cService();
