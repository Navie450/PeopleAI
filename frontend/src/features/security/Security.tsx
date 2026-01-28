import { Box, Typography, Grid, Card, CardContent, alpha } from '@mui/material'
import { Security as SecurityIcon, VerifiedUser, GppGood, Assessment } from '@mui/icons-material'

export const Security = () => {
    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    Security Audit
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.5)', fontWeight: 500 }}>
                    Monitor system health and enterprise security protocols.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {[
                    { title: 'Security Score', value: '98%', icon: VerifiedUser, color: '#10B981', desc: 'Optimal Protection' },
                    { title: 'Active Shields', value: '12', icon: GppGood, color: '#0F172A', desc: 'Real-time monitoring' },
                    { title: 'Last Audit', value: '2h ago', icon: Assessment, color: '#F59E0B', desc: 'System scan complete' },
                ].map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card sx={{
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            borderRadius: 4,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)',
                                '& .security-icon': {
                                    transform: 'scale(1.1) rotate(5deg)',
                                }
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                                borderRadius: '4px 4px 0 0',
                                boxShadow: `0 2px 8px ${item.color}40`
                            }
                        }}>
                            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Box className="security-icon" sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: alpha(item.color, 0.05),
                                    color: item.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 3,
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <item.icon sx={{ fontSize: 24 }} />
                                </Box>
                                <Typography variant="h2" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '2.5rem', mb: 1 }}>{item.value}</Typography>
                                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', mb: 1.5, letterSpacing: '0.05em' }}>{item.title}</Typography>
                                <Typography variant="caption" sx={{ color: item.color, fontWeight: 700, px: 1.5, py: 0.5, bgcolor: alpha(item.color, 0.1), borderRadius: 50 }}>{item.desc}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Card sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.01)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        borderRadius: 4,
                        boxShadow: 'none',
                        minHeight: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <SecurityIcon sx={{ fontSize: 64, color: 'rgba(0, 0, 0, 0.02)', mb: 2 }} />
                            <Typography variant="h3" sx={{ color: 'rgba(0, 0, 0, 0.3)', fontWeight: 600 }}>
                                Advanced logs coming soon
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
