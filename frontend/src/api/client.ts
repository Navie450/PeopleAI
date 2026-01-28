import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { storage } from '@/utils/storage'
import { authApi } from './auth.api'

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - inject access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response interceptor - handle token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = storage.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const { data } = await authApi.refreshToken(refreshToken)
        const newAccessToken = data.data!.tokens.access_token
        storage.setAccessToken(newAccessToken)

        // Retry all queued requests
        failedQueue.forEach((callback) => callback.resolve(newAccessToken))
        failedQueue = []

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return apiClient(originalRequest)
      } catch (refreshError) {
        failedQueue.forEach((callback) => callback.reject(refreshError))
        failedQueue = []
        storage.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
