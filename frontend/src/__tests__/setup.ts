import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'

// Must mock env config before any other imports use it
vi.mock('@/config/env', () => ({
  env: {
    VITE_API_URL: 'http://localhost:5001/api/v1',
    VITE_SESSION_TIMEOUT_MINUTES: 30,
  },
}))

// Import server after mocks are set up
const { server } = await import('./mocks/server')

// Start MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
  sessionStorage.clear()
  // Reset location.href (tests like logout set it to '/login' which breaks MSW URL resolution)
  window.location.href = 'http://localhost:3000'
})
afterAll(() => server.close())

// Mock window.location (href must be a valid URL for MSW URL resolution)
Object.defineProperty(window, 'location', {
  writable: true,
  value: { ...window.location, href: 'http://localhost:3000', assign: vi.fn(), replace: vi.fn() },
})
