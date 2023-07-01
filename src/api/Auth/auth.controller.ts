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
import { Request, Response } from "express";
import { generateTokens } from './../../utils/jwt';
import { v4 } from 'uuid'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { hashToken } from '../../utils/hashToken';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send('You must provide an email and a password.');
      return;
    }
    
    const existingUser = await findUserByEmail(email);
    if (!!existingUser) {
      res.status(400).send('Email already in use.');
      return;
    }

    const user = await createUserByEmailAndPassword({ email, password })
    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    console.log(err.message)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send('You must provide an email and a password.');
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      res.status(403).send('Invalid login credentials.');
      return;
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403).send('Invalid login credentials.');
      return;
    }

    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken, userId: existingUser.id });

    res.json({
      accessToken,
      refreshToken,
    })
  } catch (err: any) {
    console.log(err.message)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}

export const refreshUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).send('Missing refresh token.');
      return;
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
    const savedRefreshToken = await findRefreshTokenById(payload.jti as string);
    if (!savedRefreshToken || !!savedRefreshToken.revoked) {
      res.status(401).send('Unauthorized');
      return;
    }
    
    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401).send('Unauthorized');
      return;
    }

    const user = await findUserById(payload.userId);
    if (!user) {
      res.status(401).send('Unauthorized');
      return;
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = v4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err: any) {
    console.log(err.message)
    res.status(500).json({
      message: "Internal Server Error",
    })
  }
}