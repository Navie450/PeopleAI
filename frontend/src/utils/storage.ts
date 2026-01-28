import type { User } from '@/types'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'
const REMEMBER_ME_KEY = 'remember_me'

export const storage = {
  getAccessToken: () => {
    // Check if remember me is enabled, if so use localStorage, otherwise sessionStorage
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true'
    return rememberMe
      ? localStorage.getItem(TOKEN_KEY)
      : sessionStorage.getItem(TOKEN_KEY)
  },

  setAccessToken: (token: string, rememberMe: boolean = false) => {
    // Store remember me preference
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe))

    // Store access token in appropriate storage
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token)
      // Clear from sessionStorage if it exists there
      sessionStorage.removeItem(TOKEN_KEY)
    } else {
      sessionStorage.setItem(TOKEN_KEY, token)
      // Clear from localStorage if it exists there
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),

  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

  clearTokens: () => {
    // Clear from both storages to be safe
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(REMEMBER_ME_KEY)
  }
}
