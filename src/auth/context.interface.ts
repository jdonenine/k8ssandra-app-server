import {User} from '../models/user';
import {Request, Response} from 'express';
import {verify} from 'jsonwebtoken';
import {APP_SECRET} from '../index';

export interface Context {
  req: Request;
  res: Response;
  user?: User;
  iat?: number;
  exp?: number;
}

function decodeAuthHeader(authHeader: String): any {
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return;
  }
  try {
    return verify(token, APP_SECRET);
  } catch (error) {
    return;
  }
}

export const context = ({req, res}: {req: Request; res: Response}): Context => {
  const content = req && req.headers.authorization ? decodeAuthHeader(req.headers.authorization) : undefined;

  if (!content) {
    return {
      req: req,
      res: res,
    };
  }

  return {
    req: req,
    res: res,
    iat: content.iat,
    exp: content.exp,
    user: {
      id: content.id,
      password: content.password,
      roles: content.roles,
    },
  };
};
