import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
  Button,
  alpha,
  Chip,
} from '@mui/material'
import {
  EventNote as LeaveIcon,
  Flag as GoalIcon,
  Campaign as AnnouncementIcon,
  ArrowForward as ArrowIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { employeesApi } from '@/api/employees.api'
import { leaveRequestsApi } from '@/api/leave-requests.api'
import { announcementsApi } from '@/api/announcements.api'
import { useAuth } from '@/hooks/useAuth'
import type { Employee, LeaveBalanceSummary, AnnouncementListItem, PerformanceGoal } from '@/types'
import { LeaveBalanceCard, AnnouncementCard } from './components'

export const EmployeePortalDashboard = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Employee | null>(null)
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceSummary[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [profileRes, balancesRes, announcementsRes] = await Promise.all([
          employeesApi.getMyProfile(),
          leaveRequestsApi.getMyLeaveBalances(),
          announcementsApi.list({ limit: 3 }),
        ])

        setProfile(profileRes.data.data || null)
        setLeaveBalances(balancesRes.data.data || [])
        setAnnouncements(announcementsRes.data.data || [])
      } catch (error) {
        enqueueSnackbar('Failed to load dashboard data', { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [enqueueSnackbar])

  const activeGoals = profile?.performance_goals?.filter(
    (g) => g.status === 'in_progress' || g.status === 'not_started'
  ) || []

  const completedGoals = profile?.performance_goals?.filter(
    (g) => g.status === 'completed'
  ) || []

  const avgGoalProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((acc, g) => acc + g.progress_percentage, 0) / activeGoals.length)
    : 0

  return (
    <Box sx={{ p: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          Welcome back{profile ? `, ${profile.first_name}` : ''}!
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B' }}>
          Here's what's happening with your work today.
        </Typography>
      </Box>

      {/* Profile Summary Card */}
      <Card
        sx={{
          mb: 4,
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 4,
          overflow: 'hidden',
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box
          sx={{
            height: 80,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          }}
        />
        <CardContent sx={{ position: 'relative', pt: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Skeleton variant="circular" width={96} height={96} sx={{ mt: -6 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={150} height={24} />
              </Box>
            </Box>
          ) : profile ? (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Avatar
                src={profile.profile_picture_url}
                sx={{
                  width: 96,
                  height: 96,
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  mt: -6,
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {!profile.profile_picture_url && `${profile.first_name[0]}${profile.last_name[0]}`}
              </Avatar>
              <Box sx={{ flex: 1, pt: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {profile.full_name}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', mb: 1 }}>
                  {profile.job_title}
                  {profile.department && ` • ${profile.department.name}`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={profile.employee_id}
                    size="small"
                    sx={{
                      backgroundColor: alpha('#0F172A', 0.1),
                      color: '#0F172A',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={`${profile.years_of_service} years`}
                    size="small"
                    sx={{
                      backgroundColor: alpha('#10B981', 0.1),
                      color: '#10B981',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>
              <Button
                variant="outlined"
                onClick={() => navigate('/my-profile')}
                sx={{ mt: 1 }}
              >
                View Profile
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  mt: -6,
                  backgroundColor: '#64748B',
                  color: '#FFFFFF',
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
              </Avatar>
              <Box sx={{ flex: 1, pt: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {user?.display_name || user?.email || 'Admin User'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B', mb: 1 }}>
                  Administrator Account
                </Typography>
                <Chip
                  label="No Employee Profile"
                  size="small"
                  sx={{
                    backgroundColor: alpha('#F59E0B', 0.1),
                    color: '#F59E0B',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              },
            }}
            onClick={() => navigate('/my-leave')}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: alpha('#3B82F6', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LeaveIcon sx={{ color: '#3B82F6' }} />
                </Box>
                <ArrowIcon sx={{ color: '#64748B' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                {loading ? <Skeleton width={60} /> : leaveBalances[0]?.available_days || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Annual Leave Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              },
            }}
            onClick={() => navigate('/my-goals')}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: alpha('#10B981', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GoalIcon sx={{ color: '#10B981' }} />
                </Box>
                <ArrowIcon sx={{ color: '#64748B' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                {loading ? <Skeleton width={60} /> : `${activeGoals.length}/${profile?.performance_goals?.length || 0}`}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Active Goals ({avgGoalProgress}% avg)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              },
            }}
            onClick={() => navigate('/announcements')}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: alpha('#F59E0B', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AnnouncementIcon sx={{ color: '#F59E0B' }} />
                </Box>
                <ArrowIcon sx={{ color: '#64748B' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                {loading ? <Skeleton width={60} /> : announcements.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                New Announcements
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Balances */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
              Leave Balances
            </Typography>
            <Button
              size="small"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/my-leave')}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={2}>
            {loading ? (
              [1, 2].map((i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
                </Grid>
              ))
            ) : (
              leaveBalances.slice(0, 4).map((balance, index) => (
                <Grid item xs={12} sm={6} key={balance.leave_type}>
                  <LeaveBalanceCard
                    balance={balance}
                    color={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4]}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>

        {/* Recent Announcements */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
              Recent Announcements
            </Typography>
            <Button
              size="small"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/announcements')}
            >
              View All
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loading ? (
              [1, 2].map((i) => (
                <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 3 }} />
              ))
            ) : announcements.length > 0 ? (
              announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onClick={() => navigate('/announcements')}
                />
              ))
            ) : (
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  No announcements yet
                </Typography>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
