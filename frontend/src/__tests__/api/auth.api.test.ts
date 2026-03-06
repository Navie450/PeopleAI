import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { authApi } from '@/api/auth.api'

const BASE_URL = 'http://localhost:5001/api/v1'

describe('Auth API', () => {
  describe('login', () => {
    it('should send login request and return tokens + user', async () => {
      const { data } = await authApi.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(data.success).toBe(true)
      expect(data.data!.tokens.access_token).toBeDefined()
      expect(data.data!.user.email).toBe('test@example.com')
    })

    it('should handle login error', async () => {
      server.use(
        http.post(`${BASE_URL}/auth/login`, () => {
          return HttpResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } },
            { status: 401 }
          )
        })
      )

      await expect(
        authApi.login({ email: 'bad@example.com', password: 'wrong' })
      ).rejects.toThrow()
    })
  })

  describe('register', () => {
    it('should send registration request and return tokens + user', async () => {
      const { data } = await authApi.register({
        email: 'new@example.com',
        password: 'StrongP@ss1!',
        first_name: 'Jane',
        last_name: 'Doe',
      })

      expect(data.success).toBe(true)
      expect(data.data!.tokens).toBeDefined()
    })
  })

  describe('refreshToken', () => {
    it('should send refresh request and return new tokens', async () => {
      const { data } = await authApi.refreshToken('mock-refresh-token')

      expect(data.success).toBe(true)
      expect(data.data!.tokens.access_token).toBe('new-access-token')
    })
  })

  describe('getCurrentUser', () => {
    it('should fetch current user', async () => {
      const { data } = await authApi.getCurrentUser()

      expect(data.success).toBe(true)
      expect(data.data!.email).toBe('test@example.com')
    })
  })

  describe('logout', () => {
    it('should call logout endpoint', async () => {
      const { data } = await authApi.logout()
      expect(data.success).toBe(true)
    })
  })

  describe('changePassword', () => {
    it('should call change password endpoint', async () => {
      const { data } = await authApi.changePassword('OldP@ss1!', 'NewP@ss1!')
      expect(data.success).toBe(true)
    })
  })
})
