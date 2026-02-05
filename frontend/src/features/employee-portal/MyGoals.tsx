import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Tabs,
  Tab,
  Card,
  CardContent,
  LinearProgress,
  alpha,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { employeesApi } from '@/api/employees.api'
import type { Employee, PerformanceGoal } from '@/types'
import { GoalProgressCard } from './components'

export const MyGoals = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Employee | null>(null)
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await employeesApi.getMyProfile()
      setProfile(response.data.data)
    } catch (error) {
      enqueueSnackbar('Failed to load goals', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateGoal = async (goalId: string, progress: number, status: string) => {
    try {
      await employeesApi.updateMyGoalProgress(goalId, {
        progress_percentage: progress,
        status: status as PerformanceGoal['status'],
      })
      enqueueSnackbar('Goal updated successfully', { variant: 'success' })
      fetchProfile()
    } catch (error) {
      enqueueSnackbar('Failed to update goal', { variant: 'error' })
    }
  }

  const goals = profile?.performance_goals || []
  const activeGoals = goals.filter((g) => g.status === 'in_progress' || g.status === 'not_started')
  const completedGoals = goals.filter((g) => g.status === 'completed')
  const cancelledGoals = goals.filter((g) => g.status === 'cancelled')

  const getTabGoals = () => {
    switch (tabValue) {
      case 0:
        return activeGoals
      case 1:
        return completedGoals
      case 2:
        return cancelledGoals
      default:
        return activeGoals
    }
  }

  const overallProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((acc, g) => acc + g.progress_percentage, 0) / activeGoals.length)
    : 0

  const completionRate = goals.length > 0
    ? Math.round((completedGoals.length / goals.length) * 100)
    : 0

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        My Goals
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, mb: 1 }}>
                Active Goals
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={60} height={50} />
              ) : (
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  {activeGoals.length}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, mb: 1 }}>
                Average Progress
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={80} height={50} />
              ) : (
                <>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#3B82F6', mb: 1 }}>
                    {overallProgress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={overallProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha('#3B82F6', 0.1),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#3B82F6',
                        borderRadius: 4,
                      },
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, mb: 1 }}>
                Completion Rate
              </Typography>
              {loading ? (
                <Skeleton variant="text" width={80} height={50} />
              ) : (
                <>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#10B981', mb: 1 }}>
                    {completionRate}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    {completedGoals.length} of {goals.length} goals completed
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Goals List */}
      <Card
        sx={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 3,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            <Tab label={`Active (${activeGoals.length})`} />
            <Tab label={`Completed (${completedGoals.length})`} />
            <Tab label={`Cancelled (${cancelledGoals.length})`} />
          </Tabs>
        </Box>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) : getTabGoals().length > 0 ? (
            <Grid container spacing={2}>
              {getTabGoals().map((goal) => (
                <Grid item xs={12} md={6} key={goal.id}>
                  <GoalProgressCard
                    goal={goal}
                    onUpdate={tabValue === 0 ? handleUpdateGoal : undefined}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" sx={{ color: '#64748B' }}>
                {tabValue === 0 && 'No active goals'}
                {tabValue === 1 && 'No completed goals yet'}
                {tabValue === 2 && 'No cancelled goals'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Performance Rating */}
      {profile?.last_performance_rating && (
        <Card
          sx={{
            mt: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2 }}>
              Performance Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: alpha('#F59E0B', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                  {profile.last_performance_rating.toFixed(1)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Last Review Rating
                </Typography>
                {profile.last_review_date && (
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    Reviewed on {new Date(profile.last_review_date).toLocaleDateString()}
                  </Typography>
                )}
                {profile.next_review_date && (
                  <Typography variant="body2" sx={{ color: '#3B82F6' }}>
                    Next review: {new Date(profile.next_review_date).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
