import prisma from "../../utils/prisma";
import { hashToken } from "../../utils/hashToken";

export const addRefreshTokenToWhiteList = ({ jti, refreshToken, userId }: {
  jti: string;
  refreshToken: string;
  userId: string;
}) => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

export const findRefreshTokenById = (id: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

export const deleteRefreshToken = (id: string) => {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

export const revokeTokens = (userId: string) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}