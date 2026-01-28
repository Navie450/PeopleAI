import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  IconButton,
  alpha,
  CircularProgress,
  Paper,
} from '@mui/material'
import {
  People,
  FlashOn,
  PersonAddAlt1,
  CalendarToday,
  Add,
  MoreHoriz,
  ArrowUpward,
  Security,
  Dns,
} from '@mui/icons-material'
import { usersApi } from '@/api/users.api'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/types'

interface StatCardProps {
  title: string
  value: string | number
  icon: any
  change: string
  color: string
}

const StatCard = ({ title, value, icon: Icon, change, color }: StatCardProps) => (
  <Card sx={{
    height: '100%',
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)',
      borderColor: 'rgba(15, 23, 42, 0.2)',
      '& .stat-icon': {
        transform: 'scale(1.15) rotate(5deg)',
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: `linear-gradient(90deg, ${color}, ${color}dd)`,
      boxShadow: `0 2px 8px ${color}40`,
    }
  }}>
    <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Box
        className="stat-icon"
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          backgroundColor: alpha(color, 0.05),
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          transition: 'transform 0.3s ease',
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
      </Box>
      <Typography variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1, color: '#0F172A' }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', mb: 2, letterSpacing: '0.05em' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10B981' }}>
        <ArrowUpward sx={{ fontSize: 14 }} />
        <Typography variant="caption" sx={{ fontWeight: 700 }}>{change}</Typography>
      </Box>
    </CardContent>
  </Card>
)

const SecurityHealthCard = ({ score }: { score: number }) => (
  <Card sx={{
    height: '100%',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    border: '1px solid rgba(15, 23, 42, 0.15)',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25), 0 6px 16px rgba(0, 0, 0, 0.12)',
      borderColor: 'rgba(15, 23, 42, 0.3)',
      '& .health-progress': {
        transform: 'scale(1.05)',
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 100%)',
      boxShadow: '0 2px 12px rgba(15, 23, 42, 0.4)',
    }
  }}>
    <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Box className="health-progress" sx={{ position: 'relative', display: 'inline-flex', mb: 3, transition: 'transform 0.3s ease' }}>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15, 23, 42, 0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
          zIndex: 0
        }} />
        <CircularProgress
          variant="determinate"
          value={100}
          size={120}
          thickness={7}
          sx={{
            color: '#E8EDF5',
            position: 'relative',
            zIndex: 1
          }}
        />
        <CircularProgress
          variant="determinate"
          value={score}
          size={120}
          thickness={7}
          sx={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: '#0F172A',
            position: 'absolute',
            left: 0,
            strokeLinecap: 'round',
            zIndex: 2,
            filter: 'drop-shadow(0 2px 8px rgba(15, 23, 42, 0.3))',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
              stroke: 'url(#healthGradient)',
            },
            transition: 'all 1s ease-in-out'
          }}
        />
        <svg width="0" height="0">
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>
        </svg>
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            zIndex: 3
          }}
        >
          <Typography variant="h3" sx={{
            fontWeight: 800,
            fontSize: '2rem',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {score}%
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', mt: 0.5 }}>
            HEALTH
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{
        fontWeight: 700,
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '0.05em'
      }}>
        SECURITY HEALTH SCORE
      </Typography>
    </CardContent>
  </Card>
)

export const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await usersApi.list({ page: 1, limit: 10 })
      setUsers(data.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const stats = [
    { title: 'Total Users', value: '1,284', icon: People, color: '#0F172A', change: '+12%' },
    { title: 'Active Users', value: '942', icon: FlashOn, color: '#0F172A', change: '+8%' },
    { title: 'New This Week', value: '48', icon: PersonAddAlt1, color: '#0F172A', change: '+23%' },
  ]

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: '100%',
        ml: 0,
        minHeight: 'calc(100vh - 64px)',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {/* Top Header - Consolidated */}
      {/* Top Header Section */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, mb: 4, gap: 3 }}>
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: '2.25rem',
              fontWeight: 800,
              mb: 1,
              color: '#0F172A',
              animation: 'fadeIn 0.5s ease-out forwards'
            }}
          >
            Good morning, {user?.first_name || 'Admin'}!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#64748B' }}>
              Enterprise security status:
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#F0FDF4',
              color: '#16A34A',
              px: 1.5,
              py: 0.5,
              borderRadius: 50,
              border: '1px solid #DCFCE7'
            }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#16A34A' }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>Protected</Typography>
            </Box>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} sx={{ animation: 'fadeIn 0.5s ease-out 0.1s both' }}>
          <Button
            variant="outlined"
            startIcon={<CalendarToday sx={{ fontSize: '18px !important' }} />}
            sx={{
              bgcolor: '#FFFFFF',
              borderColor: '#E2E8F0',
              color: '#475569',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              height: 44,
              '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' },
            }}
            endIcon={<Typography component="span" sx={{ fontSize: '0.65rem', ml: 1 }}>▼</Typography>}
          >
            Oct 1, 2023 - Oct 31, 2023
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: '#475569',
              borderColor: '#E2E8F0',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              height: 44,
              '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' },
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: '#0F172A',
              borderRadius: 2,
              px: 3,
              height: 44,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              '&:hover': { bgcolor: '#1a2236' },
            }}
          >
            New Protocol
          </Button>
        </Stack>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title} sx={{ animation: `fadeIn 0.5s ease-out ${0.2 + index * 0.1}s both` }}>
            <StatCard {...stat} />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={3} sx={{ animation: 'fadeIn 0.5s ease-out 0.5s both' }}>
          <SecurityHealthCard score={92} />
        </Grid>
      </Grid>

      {/* Main Content Layout */}
      <Grid container spacing={4}>
        {/* Left Column: Recent Users */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A' }}>
              Recent Users
            </Typography>
            <Button
              variant="text"
              onClick={() => navigate('/users')}
              sx={{ color: '#0F172A', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: alpha('#0F172A', 0.05) } }}
            >
              View Directory →
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ bgcolor: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.06)', borderRadius: 4, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#0F172A' }}>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>Identity</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</TableCell>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8, border: 0 }}>
                      <CircularProgress size={32} thickness={5} />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8, border: 0 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.4)' }}>No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.slice(0, 3).map((u) => (
                    <TableRow key={u.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ py: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'rgba(15, 23, 42, 0.15)',
                              color: '#0F172A',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {u.first_name?.[0] || u.email[0].toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                            {u.first_name} {u.last_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                          {u.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <Chip
                          label="ACTIVE"
                          size="small"
                          sx={{
                            height: 20,
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10B981',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            borderRadius: '4px',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <Stack direction="row" spacing={0.5}>
                          <Chip
                            label="SUPER"
                            size="small"
                            sx={{ height: 20, bgcolor: 'rgba(0, 0, 0, 0.05)', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 600, fontSize: '0.65rem' }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <IconButton size="small" sx={{ color: 'rgba(0, 0, 0, 0.4)' }}>
                          <MoreHoriz />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Right Column: Management Hub */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.4)', fontWeight: 800, letterSpacing: '0.1em' }}>
              MANAGEMENT HUB
            </Typography>
          </Box>
          <Stack spacing={2}>
            {[
              { title: 'Add User', desc: 'PROVISION IDENTITY', icon: PersonAddAlt1 },
              { title: 'Directory', desc: 'CORPORATE SEARCH', icon: Dns },
              { title: 'Security Audit', desc: 'REVIEW LOGS', icon: Security },
            ].map((item) => (
              <Card key={item.title} sx={{
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#F8FAFC',
                  borderColor: '#0F172A',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#FFFFFF', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <item.icon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.925rem' }}>{item.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#0F172A', fontWeight: 800, fontSize: '0.65rem' }}>{item.desc}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Support Section */}
          <Card sx={{ mt: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', borderRadius: 3, boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, mb: 3, lineHeight: 1.6 }}>
                Access our 24/7 enterprise support line for security inquiries.
              </Typography>
              <Button
                variant="text"
                sx={{
                  color: '#0F172A',
                  fontWeight: 800,
                  p: 0,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
