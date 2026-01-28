import { createTheme } from '@mui/material/styles'

// Design Tokens based on PeopleAI Design System
export const tokens = {
  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    monoFamily: "'JetBrains Mono', 'Courier New', monospace",
    display: {
      fontSize: '1.875rem', // 30px
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h1: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h2: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    bodyLg: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    bodyMd: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    small: {
      fontSize: '0.75rem', // 12px
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },

  // Colors
  colors: {
    primary: {
      50: '#F1F5F9',
      100: '#E2E8F0',
      500: '#0F172A', // Enterprise Dark Navy
      600: '#1a2236',
      700: '#000000',
    },
    enterprise: {
      darkNavy: '#0F172A', // Dark navy background
      navy: '#1E293B',
      gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    },
    ai: {
      50: '#F5F3FF',
      500: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0EA5E9',
    },
    neutral: {
      white: '#FFFFFF',
      ground: '#F9FAFB',
      textMain: '#0F172A',
      textMuted: '#64748B',
      borderLight: '#E2E8F0',
    },
  },

  // Spacing (4px grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Shape
  shape: {
    radiusSm: 4,
    radiusMd: 8,
    radiusLg: 12,
    radiusFull: 9999,
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    // Elevated card shadows
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    cardHover: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
    // Navy glow for accent elements
    blueGlow: '0 4px 14px rgba(15, 23, 42, 0.25), 0 2px 8px rgba(15, 23, 42, 0.15)',
    blueGlowStrong: '0 8px 24px rgba(15, 23, 42, 0.35), 0 4px 12px rgba(15, 23, 42, 0.2)',
  },
}

// Material-UI Theme
export const theme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.primary[500],
      light: tokens.colors.primary[100],
      dark: tokens.colors.primary[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: tokens.colors.ai[500],
      light: tokens.colors.ai[50],
      contrastText: '#FFFFFF',
    },
    success: {
      main: tokens.colors.semantic.success,
    },
    warning: {
      main: tokens.colors.semantic.warning,
    },
    error: {
      main: tokens.colors.semantic.error,
    },
    info: {
      main: tokens.colors.semantic.info,
    },
    background: {
      default: tokens.colors.neutral.ground,
      paper: tokens.colors.neutral.white,
    },
    text: {
      primary: tokens.colors.neutral.textMain,
      secondary: tokens.colors.neutral.textMuted,
    },
    divider: tokens.colors.neutral.borderLight,
  },

  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: {
      fontSize: tokens.typography.h1.fontSize,
      fontWeight: tokens.typography.h1.fontWeight,
      lineHeight: tokens.typography.h1.lineHeight,
      color: tokens.colors.neutral.textMain,
    },
    h2: {
      fontSize: tokens.typography.h2.fontSize,
      fontWeight: tokens.typography.h2.fontWeight,
      lineHeight: tokens.typography.h2.lineHeight,
      color: tokens.colors.neutral.textMain,
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: tokens.typography.bodyLg.fontSize,
      lineHeight: tokens.typography.bodyLg.lineHeight,
    },
    body2: {
      fontSize: tokens.typography.bodyMd.fontSize,
      lineHeight: tokens.typography.bodyMd.lineHeight,
    },
    caption: {
      fontSize: tokens.typography.small.fontSize,
      fontWeight: tokens.typography.small.fontWeight,
      lineHeight: tokens.typography.small.lineHeight,
    },
  },

  shape: {
    borderRadius: tokens.shape.radiusMd,
  },

  shadows: [
    'none',
    tokens.shadows.sm,
    tokens.shadows.sm,
    tokens.shadows.md,
    tokens.shadows.md,
    tokens.shadows.md,
    tokens.shadows.md,
    tokens.shadows.md,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
    tokens.shadows.lg,
  ],

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.shape.radiusSm,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: tokens.shadows.sm,
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.shape.radiusMd,
          boxShadow: tokens.shadows.card,
          border: `1px solid ${tokens.colors.neutral.borderLight}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.shape.radiusMd,
            '& fieldset': {
              borderColor: tokens.colors.neutral.borderLight,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.shape.radiusSm,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: tokens.shape.radiusMd,
        },
      },
    },
  },
})

export default theme
