// the reflect-metadata import must precede any other imports of type-graphql
import 'reflect-metadata';

import {ApolloServer} from 'apollo-server';
import {buildSchema} from 'type-graphql';
import {ServerInfo} from 'apollo-server/src';
import {AUTH_CHECKER} from './auth/auth-checker';
import {exit} from 'process';
import {context} from './auth/context.interface';
import {AuthResolver} from './resolvers/auth.resolver';
import {UserResolver} from './resolvers/user.resolver';
import {LOCAL_USER_SERVICE} from './services/local-user.service';
import {ROLES_ALL} from './auth/roles';
import {PODS_SERVICE} from './services/pods.service';
import {SECRET_SERVICE} from './services/secret.service';
import {K8cResolver} from './resolvers/k8c.resolver';

export const APP_SECRET = process.env.APP_SECRET || '';
if (!APP_SECRET?.length) {
  console.error('No valid APP_SECRET not provided, server cannot start.');
  exit(1);
}
export const APP_TOKEN_EXPIRE_HOURS = process.env.APP_TOKEN_EXPIRE_HOURS || 2;
export const APP_DEBUG = process.env.APP_DEBUG === 'true' ? true : false;

const APP_PORT = +(process.env.APP_PORT || 3000);

const APP_SUPER_USER_INIT = process.env.APP_SUPER_USER_INIT === 'true' ? true : false;
const APP_SUPER_USER_ID = process.env.APP_SUPER_USER_ID || 'admin';
const APP_SUPER_USER_PASSWORD = process.env.APP_SUPER_USER_PASSWORD || 'admin';
if (APP_SUPER_USER_INIT) {
  LOCAL_USER_SERVICE.addUser(APP_SUPER_USER_ID, APP_SUPER_USER_PASSWORD, ROLES_ALL)
    .then(() =>
      console.log(
        `Initialized default super-user with username '${APP_SUPER_USER_ID}' and password '${APP_SUPER_USER_PASSWORD}'`,
      ),
    )
    .catch((error) => console.error('Unable to initialize default super-user', error));
}

PODS_SERVICE.getPods('kind-k8ssandra-0', 'k8ssandra-operator')
  .then((pods) => console.log(pods))
  .catch((error) => console.error(error));
SECRET_SERVICE.getSecrets('kind-k8ssandra-0', 'k8ssandra-operator')
  .then((secrets) => console.log(secrets))
  .catch((error) => console.error(error));

async function main(): Promise<ServerInfo> {
  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver, K8cResolver],
    authChecker: AUTH_CHECKER,
  });
  const server = new ApolloServer({
    schema: schema,
    debug: APP_DEBUG,
    introspection: true,
    context: context,
  });
  return server.listen(APP_PORT);
}
main()
  .then((serverInfo) => console.log('Server started: ', serverInfo.url))
  .catch((error) => console.error('Server failed to start with error:', error));
