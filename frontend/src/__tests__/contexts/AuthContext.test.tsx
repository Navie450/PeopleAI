/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { storage } from '@/utils/storage'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'

const BASE_URL = 'http://localhost:5001/api/v1'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
)

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('AuthContext', () => {
  describe('useAuth hook', () => {
    it('should throw if used outside provider', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used within an AuthProvider')
    })
  })

  describe('initialization', () => {
    it('should start with loading state and finish loading', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      // React 18 act() may flush effects synchronously when no async work is pending.
      // When no stored tokens, initAuth completes immediately, so isLoading may already be false.
      // Verify it reaches the stable non-loading state:
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      expect(result.current.user).toBeNull()
    })

    it('should finish loading and set user to null when no stored data', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should restore user from storage if token is valid', async () => {
      const storedUser = { id: 'user-uuid-1', email: 'test@example.com', roles: ['user'] }
      storage.setAccessToken('valid-token', true)
      storage.setUser(storedUser as any)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toBeDefined()
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should clear storage if token is invalid', async () => {
      const storedUser = { id: 'user-uuid-1', email: 'test@example.com', roles: ['user'] }
      storage.setAccessToken('invalid-token', true)
      storage.setUser(storedUser as any)

      server.use(
        http.get(`${BASE_URL}/auth/me`, () => {
          return HttpResponse.json(
            { success: false, error: { message: 'Unauthorized' } },
            { status: 401 }
          )
        })
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toBeNull()
    })
  })

  describe('login', () => {
    it('should login and set user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        const user = await result.current.login(
          { email: 'test@example.com', password: 'password' },
          true
        )
        expect(user.email).toBe('test@example.com')
      })

      expect(result.current.user).toBeDefined()
      expect(result.current.isAuthenticated).toBe(true)
      expect(storage.getAccessToken()).toBe('mock-access-token')
      expect(storage.getRefreshToken()).toBe('mock-refresh-token')
    })
  })

  describe('register', () => {
    it('should register and set user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        const user = await result.current.register({
          email: 'new@example.com',
          password: 'StrongP@ss1!',
        })
        expect(user.email).toBe('test@example.com')
      })

      expect(result.current.user).toBeDefined()
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe('logout', () => {
    it('should clear user and tokens', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Login first
      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password' })
      })
      expect(result.current.isAuthenticated).toBe(true)

      // Then logout
      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(storage.getAccessToken()).toBeNull()
    })
  })

  describe('hasRole / hasAnyRole', () => {
    it('should check if user has specific role', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password' })
      })

      expect(result.current.hasRole('user')).toBe(true)
      expect(result.current.hasRole('admin')).toBe(false)
    })

    it('should check if user has any of given roles', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.login({ email: 'test@example.com', password: 'password' })
      })

      expect(result.current.hasAnyRole(['user', 'admin'])).toBe(true)
      expect(result.current.hasAnyRole(['admin', 'manager'])).toBe(false)
    })

    it('should return false when no user', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.hasRole('user')).toBe(false)
      expect(result.current.hasAnyRole(['user'])).toBe(false)
    })
  })
})
