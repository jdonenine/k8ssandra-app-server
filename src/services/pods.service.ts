import {CoreV1Api, V1PodList} from '@kubernetes/client-node';
import {getKubeConfigForContext} from './k8s.utils';

export class PodsService {
  async getPods(context: string, namespace: string): Promise<V1PodList> {
    const kc = getKubeConfigForContext(context);
    const k8sApi = kc.makeApiClient(CoreV1Api);
    const response = await k8sApi.listNamespacedPod(namespace?.trim());
    return Promise.resolve(response.body);
  }
}

export const PODS_SERVICE = new PodsService();
