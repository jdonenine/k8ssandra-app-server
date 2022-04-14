import {CoreV1Api, V1Secret, V1SecretList} from '@kubernetes/client-node';
import {getKubeConfigForContext} from './k8s.utils';

export class SecretService {
  async getSecrets(context: string, namespace: string): Promise<V1SecretList> {
    const kc = getKubeConfigForContext(context);
    const api = kc.makeApiClient(CoreV1Api);
    const response = await api.listNamespacedSecret(namespace?.trim());
    const secretList = new V1SecretList();
    Object.assign(secretList, response.body);
    return Promise.resolve(secretList);
  }

  async getSecret(context: string, namespace: string, name: string): Promise<V1Secret> {
    const kc = getKubeConfigForContext(context);
    const api = kc.makeApiClient(CoreV1Api);
    const response = await api.readNamespacedSecret(name, namespace);
    return Promise.resolve(response.body);
  }
}

export const SECRET_SERVICE = new SecretService();
