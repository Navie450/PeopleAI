import React, { useState } from 'react'
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Divider,
    Stack,
    Alert,
    InputAdornment,
    Fade,
    Slide,
} from '@mui/material'
import {
    Email,
    ArrowBack,
    AutoAwesome,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { tokens } from '../../theme'
import logo from '../../assets/peopleai-logo.png'
import authBg from '../../assets/auth-bg.png'

export const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // TODO: Implement password reset API call
            // await authApi.requestPasswordReset(email)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to send reset link. Please try again.')
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
                    <Box sx={{ mb: 6, animation: 'slideDown 0.6s ease-out' }}>
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
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                animation: 'fadeIn 0.8s ease-out',
                                '@keyframes fadeIn': {
                                    from: { opacity: 0 },
                                    to: { opacity: 1 },
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 1,
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(4px)',
                                }}
                            >
                                <AutoAwesome sx={{ fontSize: 14, mr: 1, color: 'white' }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Professional Tier
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Main Content */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { md: '2.5rem', lg: '3rem' },
                                fontWeight: 800,
                                mb: 3,
                                lineHeight: 1.2,
                                background: 'linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0.7))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Secure Identity<Box component="span" sx={{ display: 'block', opacity: 0.8 }}>Recovery</Box>
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 6, fontWeight: 400, maxWidth: '400px', lineHeight: 1.6 }}>
                            Robust protection for your enterprise assets.
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
                                <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>50K+</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Companies</Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>2M+</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employees</Typography>
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
                </Box>
            </Fade>

            {/* Right Side - Reset Password Form */}
            <Slide direction="left" in={true} timeout={600}>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                        backgroundColor: tokens.colors.neutral.white,
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
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 440,
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
                            <Typography
                                variant="h1"
                                sx={{
                                    mb: 1,
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    color: tokens.colors.neutral.textMain,
                                }}
                            >
                                Reset Password
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Enter your email to receive a recovery link
                            </Typography>
                        </Box>

                        {error && (
                            <Fade in={true}>
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {success ? (
                            <Fade in={true}>
                                <Box>
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        Password reset link sent! Check your email for further instructions.
                                    </Alert>
                                    <Button
                                        variant="text"
                                        startIcon={<ArrowBack />}
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            color: tokens.colors.enterprise.darkNavy,
                                            fontWeight: 600,
                                            '&:hover': {
                                                background: 'rgba(15, 23, 42, 0.05)',
                                            },
                                        }}
                                    >
                                        Back to Sign In
                                    </Button>
                                </Box>
                            </Fade>
                        ) : (
                            <>
                                {/* Reset Password Form */}
                                <form onSubmit={handleSubmit}>
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
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'block',
                                                mb: 1,
                                                color: 'text.secondary',
                                                textTransform: 'uppercase',
                                                fontWeight: 600,
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            Work Email
                                        </Typography>
                                        <TextField
                                            placeholder="name@company.com"
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
                                                mb: 4,
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
                                            {loading ? 'Sending...' : 'SEND RESET LINK →'}
                                        </Button>
                                    </Box>
                                </form>

                                <Box
                                    sx={{
                                        mt: 4,
                                        textAlign: 'center',
                                        animation: 'fadeIn 0.6s ease-out',
                                        animationDelay: '0.3s',
                                        animationFillMode: 'both',
                                        '@keyframes fadeIn': {
                                            from: { opacity: 0 },
                                            to: { opacity: 1 },
                                        },
                                    }}
                                >
                                    <Link
                                        component="button"
                                        type="button"
                                        variant="body2"
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            color: tokens.colors.enterprise.darkNavy,
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        <ArrowBack sx={{ fontSize: 16 }} />
                                        Back to Sign In
                                    </Link>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Slide>
        </Box>
    )
}
