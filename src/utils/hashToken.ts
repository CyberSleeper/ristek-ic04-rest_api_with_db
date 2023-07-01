import crypto from 'crypto'

export const hashToken = (token: string | NodeJS.ArrayBufferView) => {
  return crypto.createHash('sha512').update(token).digest('hex');
}