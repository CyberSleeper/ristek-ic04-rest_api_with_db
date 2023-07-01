import bcrypt from 'bcrypt'
import prisma from '../../utils/prisma'
import { IUser } from './interface';

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    }
  });
}

export const createUserByEmailAndPassword = (user: IUser) => {
  user.password = bcrypt.hashSync(user.password, 12);
  return prisma.user.create({
    data: user,
  })
}

export const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    }
  });
}