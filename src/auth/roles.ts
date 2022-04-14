export const ROLE_USERS_CREATE = 'users:create';
export const ROLE_USERS_READ_ALL = 'users:read-all';
export const ROLE_USERS_READ_SELF = 'users:read-self';
export const ROLE_USERS_DELETE = 'users:delete';
export const ROLE_USERS_UPDATE = 'users:update';
export const ROLE_K8C_READ = 'k8c:read';

export const ROLES_ALL = [
  ROLE_USERS_CREATE,
  ROLE_USERS_READ_ALL,
  ROLE_USERS_READ_SELF,
  ROLE_USERS_DELETE,
  ROLE_USERS_UPDATE,
  ROLE_K8C_READ,
];
export const ROLES_DEFAULT = [ROLE_USERS_READ_SELF, ROLE_K8C_READ];
