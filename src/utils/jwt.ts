import jwt from 'jsonwebtoken';
import { IUser } from './utils.interface'

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({
    userId: user.id
  }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '5m',
  });
}

export const generateRefreshToken = (user: IUser, jti: string) => {
  return jwt.sign({
    userId: user.id,
    jti
  }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '8h',
  });
}

export const generateTokens = (user: IUser, jti: string) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);
  return {
    accessToken,
    refreshToken
  };
}