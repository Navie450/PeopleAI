/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '@/utils/storage'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('storage', () => {
  describe('setAccessToken / getAccessToken', () => {
    it('should store in sessionStorage when rememberMe is false', () => {
      storage.setAccessToken('my-token', false)

      expect(sessionStorage.getItem('access_token')).toBe('my-token')
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(storage.getAccessToken()).toBe('my-token')
    })

    it('should store in localStorage when rememberMe is true', () => {
      storage.setAccessToken('my-token', true)

      expect(localStorage.getItem('access_token')).toBe('my-token')
      expect(sessionStorage.getItem('access_token')).toBeNull()
      expect(storage.getAccessToken()).toBe('my-token')
    })

    it('should default to sessionStorage (rememberMe false)', () => {
      storage.setAccessToken('my-token')

      expect(sessionStorage.getItem('access_token')).toBe('my-token')
    })

    it('should clear old storage location on switch', () => {
      storage.setAccessToken('token1', true)
      expect(localStorage.getItem('access_token')).toBe('token1')

      storage.setAccessToken('token2', false)
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(sessionStorage.getItem('access_token')).toBe('token2')
    })
  })

  describe('setRefreshToken / getRefreshToken', () => {
    it('should always use localStorage', () => {
      storage.setRefreshToken('refresh-token')

      expect(localStorage.getItem('refresh_token')).toBe('refresh-token')
      expect(storage.getRefreshToken()).toBe('refresh-token')
    })
  })

  describe('setUser / getUser', () => {
    it('should store and retrieve user object', () => {
      const user = { id: '1', email: 'test@test.com', roles: ['user'] } as any
      storage.setUser(user)

      const retrieved = storage.getUser()
      expect(retrieved).toEqual(user)
    })

    it('should return null when no user stored', () => {
      expect(storage.getUser()).toBeNull()
    })
  })

  describe('clearTokens', () => {
    it('should clear all tokens from both storages', () => {
      storage.setAccessToken('at', true)
      storage.setRefreshToken('rt')
      storage.setUser({ id: '1', email: 'test@test.com', roles: [] } as any)

      storage.clearTokens()

      expect(storage.getAccessToken()).toBeNull()
      expect(storage.getRefreshToken()).toBeNull()
      expect(storage.getUser()).toBeNull()
      expect(localStorage.getItem('remember_me')).toBeNull()
    })

    it('should clear sessionStorage access token too', () => {
      storage.setAccessToken('at', false)
      storage.clearTokens()

      expect(sessionStorage.getItem('access_token')).toBeNull()
    })
  })
})
