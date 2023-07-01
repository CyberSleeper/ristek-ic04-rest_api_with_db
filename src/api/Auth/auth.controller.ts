import { findUserByEmail, createUserByEmailAndPassword } from './../User/user.service';
import { Request, Response } from "express";
import express from "express";
import { generateTokens } from './../../utils/jwt';
import { v4 } from 'uuid'
import { addRefreshTokenToWhiteList } from './auth.service';

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