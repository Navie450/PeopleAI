import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { storage } from '@/utils/storage'

const BASE_URL = 'http://localhost:5001/api/v1'

// We need to test the interceptor behavior
// Import apiClient after setup
import { apiClient } from '@/api/client'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('API Client', () => {
  describe('request interceptor', () => {
    it('should attach authorization header when token exists', async () => {
      storage.setAccessToken('test-token', true)

      let capturedAuth: string | undefined
      server.use(
        http.get(`${BASE_URL}/test-auth`, ({ request }) => {
          capturedAuth = request.headers.get('authorization') ?? undefined
          return HttpResponse.json({ success: true })
        })
      )

      await apiClient.get('/test-auth')

      expect(capturedAuth).toBe('Bearer test-token')
    })

    it('should not attach header when no token', async () => {
      let capturedAuth: string | null = null
      server.use(
        http.get(`${BASE_URL}/test-no-auth`, ({ request }) => {
          capturedAuth = request.headers.get('authorization')
          return HttpResponse.json({ success: true })
        })
      )

      await apiClient.get('/test-no-auth')

      expect(capturedAuth).toBeNull()
    })
  })

  describe('response interceptor', () => {
    it('should pass through successful responses', async () => {
      server.use(
        http.get(`${BASE_URL}/test-success`, () => {
          return HttpResponse.json({ success: true, data: 'hello' })
        })
      )

      const { data } = await apiClient.get('/test-success')

      expect(data.success).toBe(true)
      expect(data.data).toBe('hello')
    })

    it('should reject non-401 errors without refresh attempt', async () => {
      server.use(
        http.get(`${BASE_URL}/test-500`, () => {
          return HttpResponse.json(
            { success: false, error: { message: 'Server error' } },
            { status: 500 }
          )
        })
      )

      await expect(apiClient.get('/test-500')).rejects.toThrow()
    })

    it('should attempt token refresh on 401', async () => {
      storage.setAccessToken('expired-token', true)
      storage.setRefreshToken('valid-refresh-token')

      let callCount = 0
      server.use(
        http.get(`${BASE_URL}/test-refresh`, () => {
          callCount++
          if (callCount === 1) {
            return HttpResponse.json(
              { success: false, error: { message: 'Unauthorized' } },
              { status: 401 }
            )
          }
          return HttpResponse.json({ success: true, data: 'retried' })
        })
      )

      const { data } = await apiClient.get('/test-refresh')

      expect(data.data).toBe('retried')
      expect(callCount).toBe(2)
    })

    it('should redirect to login when refresh fails', async () => {
      storage.setAccessToken('expired-token', true)
      storage.setRefreshToken('bad-refresh-token')

      server.use(
        http.get(`${BASE_URL}/test-redirect`, () => {
          return HttpResponse.json(
            { success: false },
            { status: 401 }
          )
        }),
        http.post(`${BASE_URL}/auth/refresh`, () => {
          return HttpResponse.json(
            { success: false, error: { message: 'Invalid token' } },
            { status: 401 }
          )
        })
      )

      await expect(apiClient.get('/test-redirect')).rejects.toThrow()
      expect(window.location.href).toBe('/login')
    })
  })
})
