import {Context} from './context.interface';
import {AuthChecker} from 'type-graphql';
import {User} from '../models/user';

export const AUTH_CHECKER: AuthChecker<Context> = ({context: {req, res, iat, exp, user}}, roles) => {
  if (roles.length === 0) {
    return userInContextIsValid(user, exp);
  }

  return userInContextIsValid(user, exp) && userInContextHasAllRoles(user, roles);
};

function userInContextIsValid(user: User | undefined, exp: number | undefined): boolean {
  if (!user) {
    return false;
  }
  if (!exp || exp < Math.floor(Date.now() / 1000)) {
    return false;
  }
  return true;
}

function userInContextHasAllRoles(user: User | undefined, roles: string[]): boolean {
  if (!user || !user.roles) {
    return false;
  }
  const userRoles = user.roles;
  for (let role of roles) {
    const matchedRole = userRoles.find((userRole) => userRole === role);
    if (!matchedRole) {
      return false;
    }
  }
  return true;
}
