import type { User } from './user.types'

export interface AuthTokens {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}

export interface LoginResponse {
  authorization_url: string
  code_verifier: string
  state: string
}

export interface CallbackResponse {
  tokens: AuthTokens
  user: User
}
