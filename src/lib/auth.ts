import { prisma } from "./db";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(email: string, username: string, password: string) {
  const passwordHash = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      username: username.toLowerCase(),
      displayName: username,
      passwordHash,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username: username.toLowerCase() } });
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}
