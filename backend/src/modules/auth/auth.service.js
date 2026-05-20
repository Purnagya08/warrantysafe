const bcrypt = require('bcrypt');
const { z } = require('zod');
const prisma = require('../../config/db');
const { signAccessToken } = require('../../utils/jwt.utils');
const { AppError } = require('../../utils/errors');

const authSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

const loginSchema = authSchema.pick({ email: true, password: true });

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const register = async (payload) => {
  const data = authSchema.parse(payload);
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });

  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { email: data.email, password: hashedPassword, name: data.name },
  });
  const token = signAccessToken(user);

  return { user: sanitizeUser(user), token };
};

const login = async (payload) => {
  const data = loginSchema.parse(payload);
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);

  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signAccessToken(user);
  return { user: sanitizeUser(user), token };
};

module.exports = { register, login, sanitizeUser };
