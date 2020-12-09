import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  return hashedPassword
}

export const compareHash = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

export const capitalizeFirst = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
