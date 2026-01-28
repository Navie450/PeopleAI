import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from '@/contexts/AuthContext'
import { theme } from '@/theme'
import { router } from '@/router'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
