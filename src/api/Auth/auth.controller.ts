import { 
  findUserByEmail, 
  createUserByEmailAndPassword, 
  findUserById 
} from './../User/user.service';
import { 
  addRefreshTokenToWhiteList, 
  findRefreshTokenById, 
  deleteRefreshToken, 
} from './auth.service';
import { NextFunction, Request, Response } from "express";
import { generateTokens } from './../../utils/jwt';
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { hashToken } from '../../utils/hashToken';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('You must provide an email and a password.');
    }
    
    const existingUser = await findUserByEmail(email);
    if (!!existingUser) {
      return res.status(400).send('Email already in use.');
    }

    const user = await createUserByEmailAndPassword({ email, password })
    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('You must provide an email and a password.');
    }

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(403).send('Invalid login credentials.');
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(403).send('Invalid login credentials.');
    }

    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken, userId: existingUser.id });

    res.json({
      accessToken,
      refreshToken,
    })
  } catch (err) {
    next(err);
  }
}

export const refreshUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send('Missing refresh token.');
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
    const savedRefreshToken = await findRefreshTokenById(payload.jti as string);
    if (!savedRefreshToken || !!savedRefreshToken.revoked) {
      return res.status(401).send('Unauthorized');
    }
    
    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      return res.status(401).send('Unauthorized');
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = v4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
}