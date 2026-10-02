import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function setAuthCookie(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `auth=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
  }
}

export function getAuthCookie() {
  if (typeof document === 'undefined') return null
  const name = 'auth='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(';')
  for (let cookie of cookieArray) {
    cookie = cookie.trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length)
    }
  }
  return null
}

export function clearAuthCookie() {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth=; path=/; max-age=0'
  }
}
