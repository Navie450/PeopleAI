import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Skeleton,
  alpha,
  Divider,
} from '@mui/material'
import {
  People,
  TrendingUp,
  TrendingDown,
  PersonAdd,
  PersonOff,
  Work,
  HomeWork,
  Business,
  Event,
  Timer,
  ArrowBack,
  Assessment,
} from '@mui/icons-material'
import { employeesApi } from '@/api/employees.api'
import type { EmployeeAnalytics } from '@/types'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['#0F172A', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  color: string
  subtitle?: string
}

const StatCard = ({ title, value, icon: Icon, change, changeType, color, subtitle }: StatCardProps) => (
  <Card
    sx={{
      height: '100%',
      bgcolor: '#FFFFFF',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      borderRadius: 4,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
        '& .stat-icon': { transform: 'scale(1.15) rotate(5deg)' },
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          className="stat-icon"
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: alpha(color, 0.1),
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease',
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        {change && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: changeType === 'up' ? 'rgba(16, 185, 129, 0.1)' : changeType === 'down' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
              color: changeType === 'up' ? '#10B981' : changeType === 'down' ? '#EF4444' : '#64748B',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            {changeType === 'up' ? <TrendingUp sx={{ fontSize: 16 }} /> : changeType === 'down' ? <TrendingDown sx={{ fontSize: 16 }} /> : null}
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{change}</Typography>
          </Box>
        )}
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '2rem', mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>{title}</Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: '#94A3B8', mt: 1, display: 'block' }}>{subtitle}</Typography>
      )}
    </CardContent>
  </Card>
)

export const EmployeeDashboard = () => {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<EmployeeAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await employeesApi.getAnalytics()
        setAnalytics(data.data || null)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={50} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  if (!analytics) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">No analytics data available</Typography>
      </Box>
    )
  }

  // Prepare chart data
  const statusData = Object.entries(analytics.by_status).map(([key, value]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value,
  }))

  const typeData = Object.entries(analytics.by_type).map(([key, value]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value,
  }))

  const departmentData = analytics.by_department.slice(0, 6).map((d) => ({
    name: d.department_name || 'Unassigned',
    employees: d.count,
  }))

  const locationData = [
    { name: 'Remote', value: analytics.remote_vs_onsite.remote },
    { name: 'On-site', value: analytics.remote_vs_onsite.onsite },
  ]

  return (
    <Box
      sx={{
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, animation: 'fadeIn 0.5s ease-out' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/employees')}
          sx={{ mb: 2, color: '#64748B', fontWeight: 600 }}
        >
          Back to Employees
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Employee Analytics
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
              Workforce insights and metrics
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            sx={{
              borderColor: '#E2E8F0',
              color: '#475569',
              fontWeight: 600,
              '&:hover': { borderColor: '#0F172A' },
            }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={analytics.total_employees}
            icon={People}
            color="#0F172A"
            subtitle={`${analytics.active_employees} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Hires"
            value={analytics.new_hires_this_month}
            icon={PersonAdd}
            change="+This Month"
            changeType="up"
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Terminations"
            value={analytics.terminations_this_month}
            icon={PersonOff}
            change="This Month"
            changeType="neutral"
            color="#EF4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Tenure"
            value={`${analytics.average_tenure_years.toFixed(1)} yrs`}
            icon={Timer}
            color="#8B5CF6"
          />
        </Grid>
      </Grid>

      {/* Secondary Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Event sx={{ color: '#3B82F6' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{analytics.upcoming_reviews}</Typography>
                <Typography variant="body2" color="text.secondary">Upcoming Reviews</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Work sx={{ color: '#F59E0B' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{analytics.probation_ending_soon}</Typography>
                <Typography variant="body2" color="text.secondary">Probation Ending</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HomeWork sx={{ color: '#06B6D4' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{analytics.remote_vs_onsite.remote}</Typography>
                <Typography variant="body2" color="text.secondary">Remote Workers</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(132, 204, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Business sx={{ color: '#84CC16' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{analytics.remote_vs_onsite.onsite}</Typography>
                <Typography variant="body2" color="text.secondary">On-site Workers</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Department Distribution */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Employees by Department</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: 'none',
                      borderRadius: 8,
                      color: '#FFF',
                    }}
                  />
                  <Bar dataKey="employees" fill="#0F172A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Remote vs On-site */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Work Location</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3B82F6' : '#0F172A'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: 'none',
                      borderRadius: 8,
                      color: '#FFF',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Employment Status</Typography>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: 'none',
                      borderRadius: 8,
                      color: '#FFF',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Type Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Employment Type</Typography>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: 'none',
                      borderRadius: 8,
                      color: '#FFF',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Location Distribution */}
        {analytics.by_location.length > 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Employees by Location</Typography>
              <Grid container spacing={2}>
                {analytics.by_location.map((loc, index) => (
                  <Grid item xs={6} sm={4} md={2} key={loc.location}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: alpha(COLORS[index % COLORS.length], 0.1), borderRadius: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS[index % COLORS.length] }}>
                        {loc.count}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                        {loc.location}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
