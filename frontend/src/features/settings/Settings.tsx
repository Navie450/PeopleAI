import { Box, Typography, Grid, Card, ListItem, ListItemIcon, ListItemText, List, Divider } from '@mui/material'
import { Palette, Language, Notifications, Storage } from '@mui/icons-material'

export const Settings = () => {
    const settingsGroups = [
        {
            title: 'General',
            items: [
                { label: 'Appearance', icon: Palette, desc: 'Customize platform theme' },
                { label: 'Language', icon: Language, desc: 'Change interface language' },
            ]
        },
        {
            title: 'System',
            items: [
                { label: 'Notifications', icon: Notifications, desc: 'Manage alert preferences' },
                { label: 'Cloud Storage', icon: Storage, desc: 'Enterprise data config' },
            ]
        }
    ]

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    Settings
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.5)', fontWeight: 500 }}>
                    Manage your enterprise account and platform preferences.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {settingsGroups.map((group, idx) => (
                    <Grid item xs={12} md={6} key={idx}>
                        <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700, mb: 2, px: 1 }}>
                            {group.title}
                        </Typography>
                        <Card sx={{
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            borderRadius: 4,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                                borderColor: 'rgba(15, 23, 42, 0.2)',
                            }
                        }}>
                            <List sx={{ p: 0 }}>
                                {group.items.map((item, i) => (
                                    <Box key={i}>
                                        <ListItem
                                            sx={{
                                                py: 2.5,
                                                px: 3,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    bgcolor: '#F8FAFC',
                                                    transform: 'translateX(4px)',
                                                    '& .settings-icon': {
                                                        transform: 'scale(1.1)',
                                                        color: '#0F172A',
                                                    }
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ color: '#0F172A', minWidth: 48 }}>
                                                <Box className="settings-icon" sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 2,
                                                    bgcolor: '#F1F5F9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s ease'
                                                }}>
                                                    <item.icon sx={{ fontSize: 20 }} />
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={<Typography sx={{ color: '#0F172A', fontWeight: 700, fontSize: '0.95rem' }}>{item.label}</Typography>}
                                                secondary={<Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>{item.desc}</Typography>}
                                            />
                                        </ListItem>
                                        {i < group.items.length - 1 && <Divider sx={{ borderColor: '#F1F5F9', mx: 3 }} />}
                                    </Box>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}
