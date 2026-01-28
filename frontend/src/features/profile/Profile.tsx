import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, Stack, Divider } from '@mui/material'
import {
    Person,
    Email,
    Shield as ShieldIcon,
    CalendarToday,
    AdminPanelSettings,
    WorkspacePremium
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'

export const Profile = () => {
    const { user } = useAuth()

    const infoItems = [
        { label: 'Full Name', value: `${user?.first_name} ${user?.last_name}`, icon: Person },
        { label: 'Email Address', value: user?.email, icon: Email },
        { label: 'Account Created', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active', icon: CalendarToday },
    ]

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    User Profile
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.5)', fontWeight: 500 }}>
                    Manage your personal information and platform identity.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left Column: Essential Info */}
                <Grid item xs={12} md={4}>
                    <Card sx={{
                        bgcolor: '#FFFFFF',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 4,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        textAlign: 'center',
                        p: 4,
                        position: 'relative',
                        overflow: 'visible',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            backgroundColor: '#0F172A',
                            borderRadius: '4px 4px 0 0'
                        }
                    }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: 'rgba(15, 23, 42, 0.15)',
                                color: '#0F172A',
                                fontSize: '3rem',
                                fontWeight: 700,
                                mx: 'auto',
                                mb: 3,
                                border: '4px solid rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography variant="h2" sx={{ color: '#0F172A', fontWeight: 800, mb: 1, fontSize: '1.5rem' }}>
                            {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'User'}
                        </Typography>
                        <Chip
                            label="ENTERPRISE USER"
                            icon={<WorkspacePremium sx={{ color: '#0F172A !important', fontSize: 16 }} />}
                            sx={{
                                bgcolor: '#F1F5F9',
                                color: '#0F172A',
                                fontWeight: 800,
                                fontSize: '0.7rem',
                                height: 28,
                                borderRadius: 1.5,
                                border: '1px solid #E2E8F0'
                            }}
                        />
                        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #F1F5F9' }}>
                            <Stack direction="row" justifyContent="center" spacing={3}>
                                <Box>
                                    <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '1.25rem' }}>2</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROLES</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ borderColor: '#F1F5F9' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '1.25rem' }}>ACTIVE</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>STATUS</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                {/* Right Column: Detailed Info & Preferences */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        <Card sx={{
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: 4,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AdminPanelSettings sx={{ color: '#0F172A' }} /> Account Information
                                </Typography>
                                <Grid container spacing={3}>
                                    {infoItems.map((item, idx) => (
                                        <Grid item xs={12} sm={6} key={idx}>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: '0.02em' }}>
                                                    {item.label}
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: '#0F172A', fontWeight: 700 }}>
                                                    {item.value || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card sx={{
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: 4,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ShieldIcon sx={{ color: '#0F172A' }} /> Access & Permissions
                                </Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.5)', mb: 1, fontWeight: 500 }}>
                                            Assigned Security Roles
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            {user?.user_roles?.map((ur) => (
                                                <Chip
                                                    key={ur.role.id}
                                                    label={ur.role.role_name.toUpperCase()}
                                                    sx={{
                                                        bgcolor: '#F1F5F9',
                                                        color: '#475569',
                                                        fontWeight: 700,
                                                        fontSize: '0.65rem',
                                                        height: 24,
                                                        borderRadius: 1
                                                    }}
                                                />
                                            )) || (
                                                    <Chip
                                                        label="USER"
                                                        sx={{
                                                            bgcolor: '#F1F5F9',
                                                            color: '#475569',
                                                            fontWeight: 700,
                                                            fontSize: '0.65rem',
                                                            height: 24,
                                                            borderRadius: 1
                                                        }}
                                                    />
                                                )}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}
