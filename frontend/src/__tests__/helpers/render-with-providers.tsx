import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'

const theme = createTheme()

interface ProviderOptions {
  initialEntries?: string[]
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: ProviderOptions & Omit<RenderOptions, 'wrapper'>
) {
  const { initialEntries = ['/'], ...renderOptions } = options || {}

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <AuthProvider>{children}</AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </MemoryRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}
