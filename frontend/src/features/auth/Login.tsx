import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Typography,
  Stack,
  Divider,
  Fade,
  Slide,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock, AutoAwesome, GitHub } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { tokens } from '@/theme'
import logo from '@/assets/peopleai-logo.png'
import authBg from '@/assets/auth-bg.png'

export const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password }, rememberMe)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side - Enterprise Branding */}
      <Fade in={true} timeout={800}>
        <Box
          sx={{
            flex: 1,
            background: tokens.colors.enterprise.gradient,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            p: 6,
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.5,
              pointerEvents: 'none',
            },
          }}
        >

          {/* Header */}
          <Box
            sx={{
              animation: 'fadeInUp 1s ease-out',
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(30px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                component="img"
                src={logo}
                alt="PeopleAI Logo"
                sx={{
                  height: 48,
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                background: 'rgba(15, 23, 42, 0.2)',
                border: '1px solid rgba(15, 23, 42, 0.3)',
              }}
            >
              <AutoAwesome sx={{ fontSize: 14, mr: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                Professional Tier
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              animation: 'fadeInUp 1.2s ease-out',
              '@keyframes fadeInUp': {
                from: { opacity: 0, transform: 'translateY(30px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: '3rem',
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.1,
                color: 'white',
              }}
            >
              The Modern OS for People-First Companies
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, mb: 6, fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '500px' }}>
              Streamline your workforce operations with enterprise-grade tools for employee management, payroll, and analytics.
            </Typography>

            {/* Glassy Metrics Container */}
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                p: 3,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                width: 'fit-content',
                mb: 8,
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#60A5FA', mb: 0.5 }}>50K+</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Companies</Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#60A5FA', mb: 0.5 }}>2M+</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employees</Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#60A5FA', mb: 0.5 }}>99.9%</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uptime</Typography>
              </Box>
            </Box>
          </Box>

          {/* Trust Section */}
          <Box sx={{ mt: 'auto', mb: 4 }}>
            <Typography variant="caption" sx={{ opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, mb: 2, display: 'block' }}>
              Trusted by Industry Leaders
            </Typography>
            <Stack direction="row" spacing={4} sx={{ opacity: 0.4 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '1.2rem' }}>FORTUNE</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>TECHCORP</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', fontStyle: 'italic' }}>GlobalSystems</Typography>
            </Stack>
          </Box>

          {/* Footer */}
          <Box sx={{ opacity: 0.5, mt: 6, pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>© 2024 PeopleAI. All rights reserved.</Typography>
          </Box>
        </Box>
      </Fade>

      {/* Right Side - Login Form */}
      <Slide direction="left" in={true} timeout={600}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            backgroundColor: '#F8FAFC',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Branding Watermark */}
          <Box
            component="img"
            src={authBg}
            alt=""
            sx={{
              position: 'absolute',
              width: '800px',
              height: 'auto',
              opacity: 0.05,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              filter: 'blur(20px)',
            }}
          />
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 440,
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              bgcolor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              animation: 'fadeIn 1s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                mb: 6,
                animation: 'slideDown 0.6s ease-out',
                '@keyframes slideDown': {
                  from: { opacity: 0, transform: 'translateY(-20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="img"
                  src={logo}
                  alt="PeopleAI Logo"
                  sx={{
                    height: 40,
                    width: 'auto',
                  }}
                />
              </Box>
              <Typography
                variant="h1"
                sx={{
                  mb: 1,
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: tokens.colors.neutral.textMain,
                  textAlign: 'center',
                }}
              >
                Sign In
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                Welcome back! Please enter your credentials
              </Typography>
            </Box>

            {error && (
              <Fade in={true}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    animation: 'slideUp 0.6s ease-out',
                    animationDelay: '0.1s',
                    animationFillMode: 'both',
                    '@keyframes slideUp': {
                      from: { opacity: 0, transform: 'translateY(20px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <TextField
                    label="Work Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: tokens.colors.enterprise.darkNavy,
                      },
                      '& .MuiOutlinedInput-root': {
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: tokens.colors.enterprise.darkNavy,
                          },
                        },
                      },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    animation: 'slideUp 0.6s ease-out',
                    animationDelay: '0.2s',
                    animationFillMode: 'both',
                    '@keyframes slideUp': {
                      from: { opacity: 0, transform: 'translateY(20px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: tokens.colors.enterprise.darkNavy,
                      },
                      '& .MuiOutlinedInput-root': {
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: tokens.colors.enterprise.darkNavy,
                          },
                        },
                      },
                    }}
                  />
                </Box>

                {/* Remember Me and Forgot Password */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    animation: 'slideUp 0.6s ease-out',
                    animationDelay: '0.3s',
                    animationFillMode: 'both',
                    '@keyframes slideUp': {
                      from: { opacity: 0, transform: 'translateY(20px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: 'text.secondary',
                          '&.Mui-checked': {
                            color: tokens.colors.enterprise.darkNavy,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Remember me
                      </Typography>
                    }
                  />
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate('/forgot-password')}
                    sx={{
                      color: tokens.colors.enterprise.darkNavy,
                      cursor: 'pointer',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Box
                  sx={{
                    animation: 'slideUp 0.6s ease-out',
                    animationDelay: '0.4s',
                    animationFillMode: 'both',
                    '@keyframes slideUp': {
                      from: { opacity: 0, transform: 'translateY(20px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.75,
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: tokens.colors.enterprise.darkNavy,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#1a2236',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    {loading ? 'Signing in...' : 'SIGN IN →'}
                  </Button>
                </Box>
              </Stack>
            </form>

            <Divider
              sx={{
                my: 4,
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: '0.5s',
                animationFillMode: 'both',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                Or Secure Login With
              </Typography>
            </Divider>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                mb: 4,
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: '0.6s',
                animationFillMode: 'both',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <Box
                    component="img"
                    src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                    sx={{ width: 18, height: 18 }}
                  />
                }
                sx={{
                  py: 1.25,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  color: tokens.colors.neutral.textMain,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderColor: 'rgba(0,0,0,0.2)',
                  },
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub sx={{ color: '#1B1F23', fontSize: 20 }} />}
                sx={{
                  py: 1.25,
                  borderColor: 'rgba(0,0,0,0.1)',
                  color: tokens.colors.neutral.textMain,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderColor: 'rgba(0,0,0,0.2)',
                  },
                }}
              >
                GitHub
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <Box
                    component="svg"
                    viewBox="0 0 23 23"
                    sx={{ width: 18, height: 18 }}
                  >
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </Box>
                }
                sx={{
                  py: 1.25,
                  borderColor: 'rgba(0,0,0,0.1)',
                  color: tokens.colors.neutral.textMain,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderColor: 'rgba(0,0,0,0.2)',
                  },
                }}
              >
                Microsoft
              </Button>
            </Stack>

            <Box
              sx={{
                textAlign: 'center',
                animation: 'fadeIn 0.6s ease-out',
                animationDelay: '0.7s',
                animationFillMode: 'both',
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/register')}
                  sx={{
                    color: tokens.colors.enterprise.darkNavy,
                    cursor: 'pointer',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Slide>
    </Box>
  )
}
