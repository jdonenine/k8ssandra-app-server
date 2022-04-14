import {KubeConfig} from '@kubernetes/client-node';

export function getKubeConfigForContext(contextName: string): KubeConfig {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const context = kc.getContexts().find((ctx) => ctx.name === contextName?.trim());
  if (!context) {
    throw new Error(`Context with name '${contextName?.trim()}' does not exist`);
  }
  kc.setCurrentContext(context.name);
  return kc;
}
