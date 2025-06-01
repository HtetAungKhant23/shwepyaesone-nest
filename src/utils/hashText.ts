import * as argon2 from 'argon2';
import * as crypto from 'node:crypto';

const salt = crypto.randomBytes(32);

export const hashText = async (plainText: string): Promise<string> => {
  return argon2.hash(plainText, { salt });
};

export const verifyText = async (hashedText: string, plianText: string): Promise<boolean> => {
  return argon2.verify(hashedText, plianText);
};
