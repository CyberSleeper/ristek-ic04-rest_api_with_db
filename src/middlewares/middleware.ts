import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from 'jsonwebtoken'
import { CustomRequest } from "./interface";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send('🚫 Unauthorized 🚫');
  }

  try {
    const token = authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('🚫 Unauthorized 🚫');
    }
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as Secret);
    (req as CustomRequest).payload = payload;
  } catch (err: any) {
    res.status(401);
    if (err.name === 'TokenExpiredError') {
      throw new Error(err.name);
    }
    throw new Error('🚫 Unauthorized 🚫');
  }
}