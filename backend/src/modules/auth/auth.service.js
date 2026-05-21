const bcrypt = require('bcryptjs')
const prisma = require('../../config/db')
const { generateToken } = require('../../utils/jwt.utils')

const register = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw { statusCode: 409, message: 'Email already registered' }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  const token = generateToken({ id: user.id, email: user.email })
  return { user, token }
}

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw { statusCode: 401, message: 'Invalid email or password' }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw { statusCode: 401, message: 'Invalid email or password' }

  const token = generateToken({ id: user.id, email: user.email })
  const { password: _, ...safeUser } = user
  return { user: safeUser, token }
}

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  if (!user) throw { statusCode: 404, message: 'User not found' }
  return user
}

module.exports = { register, login, getMe }