import { useEffect, useState, useRef } from 'react'
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
} from '@mui/material'
import {
  People,
  FlashOn,
  PersonAddAlt1,
  CalendarToday,
  Add,
  MoreHoriz,
  ArrowUpward,
  ArrowDownward,
  Security,
  Dns,
  Edit,
  Visibility,
  PersonOff,
  Delete,
  CheckCircle,
} from '@mui/icons-material'
import { usersApi } from '@/api/users.api'
import { employeesApi } from '@/api/employees.api'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import type { User, EmployeeAnalytics } from '@/types'
import { useSnackbar } from 'notistack'
import { ROLES } from '@/constants/roles'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  color: string
  loading?: boolean
}

const StatCard = ({ title, value, icon: Icon, change, changeType, color, loading }: StatCardProps) => (
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
      {loading ? (
        <Skeleton variant="text" width={80} height={60} />
      ) : (
        <Typography variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1, color: '#0F172A' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
      )}
      <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', mb: 2, letterSpacing: '0.05em' }}>
        {title}
      </Typography>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        color: changeType === 'positive' ? '#10B981' : changeType === 'negative' ? '#EF4444' : '#64748B'
      }}>
        {changeType === 'positive' ? (
          <ArrowUpward sx={{ fontSize: 14 }} />
        ) : changeType === 'negative' ? (
          <ArrowDownward sx={{ fontSize: 14 }} />
        ) : null}
        <Typography variant="caption" sx={{ fontWeight: 700 }}>{change}</Typography>
      </Box>
    </CardContent>
  </Card>
)

const SecurityHealthCard = ({ score, loading }: { score: number; loading?: boolean }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (loading) {
      setAnimatedScore(0)
      return
    }

    const duration = 1500 // 1.5 seconds animation
    const startValue = 0
    const endValue = score

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutCubic)

      setAnimatedScore(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    startTimeRef.current = null
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [score, loading])

  return (
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
            value={animatedScore}
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
                transition: 'stroke-dashoffset 0.1s ease-out',
              },
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
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              width: 90,
              height: 90,
              zIndex: 3
            }}
          >
            {loading ? (
              <Skeleton variant="text" width={45} height={32} />
            ) : (
              <Typography variant="h3" sx={{
                fontWeight: 800,
                fontSize: '1.5rem',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {animatedScore}%
              </Typography>
            )}
            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', mt: 0.5 }}>
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
}

// Date Range Picker Component
interface DateRange {
  startDate: Date
  endDate: Date
}

const DateRangePicker = ({
  dateRange,
  onDateRangeChange
}: {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [tempStartDate, setTempStartDate] = useState(dateRange.startDate.toISOString().split('T')[0])
  const [tempEndDate, setTempEndDate] = useState(dateRange.endDate.toISOString().split('T')[0])

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setTempStartDate(dateRange.startDate.toISOString().split('T')[0])
    setTempEndDate(dateRange.endDate.toISOString().split('T')[0])
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleApply = () => {
    onDateRangeChange({
      startDate: new Date(tempStartDate),
      endDate: new Date(tempEndDate)
    })
    handleClose()
  }

  const handlePreset = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    setTempStartDate(start.toISOString().split('T')[0])
    setTempEndDate(end.toISOString().split('T')[0])
  }

  const formatDateDisplay = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<CalendarToday sx={{ fontSize: '18px !important' }} />}
        onClick={handleOpen}
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
        {formatDateDisplay(dateRange.startDate, dateRange.endDate)}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }
        }}
      >
        <Box sx={{ p: 3, minWidth: 320 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#0F172A' }}>
            Select Date Range
          </Typography>

          {/* Quick presets */}
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            {[
              { label: '7 Days', days: 7 },
              { label: '30 Days', days: 30 },
              { label: '90 Days', days: 90 },
            ].map((preset) => (
              <Chip
                key={preset.days}
                label={preset.label}
                size="small"
                onClick={() => handlePreset(preset.days)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { bgcolor: alpha('#0F172A', 0.1) },
                }}
              />
            ))}
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Date inputs */}
          <Stack spacing={2}>
            <TextField
              label="Start Date"
              type="date"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ flex: 1, borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              sx={{
                flex: 1,
                bgcolor: '#0F172A',
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': { bgcolor: '#1a2236' },
              }}
            >
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}

// User Actions Menu Component
const UserActionsMenu = ({
  user,
  onEdit,
  onView,
  onToggleActive,
  onDelete,
}: {
  user: User
  onEdit: (user: User) => void
  onView: (user: User) => void
  onToggleActive: (user: User) => void
  onDelete: (user: User) => void
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAction = (action: () => void) => {
    handleClose()
    action()
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          color: 'rgba(0, 0, 0, 0.4)',
          '&:hover': { bgcolor: alpha('#0F172A', 0.08) }
        }}
      >
        <MoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={() => handleAction(() => onView(user))}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onEdit(user))}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction(() => onToggleActive(user))}>
          <ListItemIcon>
            {user.is_active ? <PersonOff fontSize="small" /> : <CheckCircle fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{user.is_active ? 'Deactivate' : 'Activate'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onDelete(user))} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export const Dashboard = () => {
  const { user, hasRole, hasAnyRole } = useAuth()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  // Role-based access checks
  const isAdmin = hasRole(ROLES.ADMIN)
  const isAdminOrManager = hasAnyRole([ROLES.ADMIN, ROLES.MANAGER])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<EmployeeAnalytics | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Date range state - default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    return { startDate: start, endDate: end }
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await usersApi.list({ page: 1, limit: 10 })
      setUsers(data.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
      enqueueSnackbar('Failed to fetch users', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      const { data } = await employeesApi.getAnalytics()
      setAnalytics(data.data || null)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      // Don't show error - analytics might not be available for all users
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchAnalytics()
  }, [])

  // Refetch data when date range changes
  useEffect(() => {
    // In a real implementation, you would pass date range to the API
    console.log('Date range changed:', dateRange)
    // fetchAnalytics(dateRange) - if API supports date filtering
  }, [dateRange])

  // User action handlers
  const handleViewUser = (u: User) => {
    navigate(`/users/${u.id}`)
  }

  const handleEditUser = (u: User) => {
    navigate(`/users/${u.id}/edit`)
  }

  const handleToggleActive = async (u: User) => {
    try {
      setActionLoading(true)
      if (u.is_active) {
        await usersApi.deactivate(u.id)
        enqueueSnackbar(`${u.first_name || u.email} has been deactivated`, { variant: 'success' })
      } else {
        await usersApi.activate(u.id)
        enqueueSnackbar(`${u.first_name || u.email} has been activated`, { variant: 'success' })
      }
      fetchUsers()
    } catch (error) {
      console.error('Failed to toggle user status:', error)
      enqueueSnackbar('Failed to update user status', { variant: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteClick = (u: User) => {
    setUserToDelete(u)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      setActionLoading(true)
      await usersApi.delete(userToDelete.id)
      enqueueSnackbar(`${userToDelete.first_name || userToDelete.email} has been deleted`, { variant: 'success' })
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      fetchUsers()
      fetchAnalytics()
    } catch (error) {
      console.error('Failed to delete user:', error)
      enqueueSnackbar('Failed to delete user', { variant: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  // Management Hub handlers
  const handleAddUser = () => {
    navigate('/users/new')
  }

  const handleOpenDirectory = () => {
    navigate('/users')
  }

  const handleSecurityAudit = () => {
    navigate('/audit-logs')
  }

  // Calculate stats from analytics
  const stats = [
    {
      title: 'Total Employees',
      value: analytics?.total_employees ?? 0,
      icon: People,
      color: '#0F172A',
      change: analytics ? `${analytics.new_hires_this_month} new this month` : 'Loading...',
      changeType: 'neutral' as const,
      loading: analyticsLoading
    },
    {
      title: 'Active Employees',
      value: analytics?.active_employees ?? 0,
      icon: FlashOn,
      color: '#0F172A',
      change: analytics
        ? `${Math.round((analytics.active_employees / (analytics.total_employees || 1)) * 100)}% active`
        : 'Loading...',
      changeType: 'positive' as const,
      loading: analyticsLoading
    },
    {
      title: 'New This Month',
      value: analytics?.new_hires_this_month ?? 0,
      icon: PersonAddAlt1,
      color: '#0F172A',
      change: analytics?.terminations_this_month
        ? `${analytics.terminations_this_month} departures`
        : 'No departures',
      changeType: (analytics?.new_hires_this_month ?? 0) > (analytics?.terminations_this_month ?? 0)
        ? 'positive' as const
        : 'negative' as const,
      loading: analyticsLoading
    },
  ]

  // Calculate security health score based on various factors
  const calculateSecurityScore = () => {
    if (!analytics) return 92 // Default score

    let score = 100

    // Deduct points for terminated employees still in system (if any)
    const activeRatio = analytics.active_employees / (analytics.total_employees || 1)
    if (activeRatio < 0.9) score -= 5

    // Deduct points for pending reviews
    if (analytics.upcoming_reviews > 10) score -= 3

    // Deduct points for probation ending soon without review
    if (analytics.probation_ending_soon > 5) score -= 2

    return Math.max(score, 70) // Minimum score of 70
  }

  const managementHubItems = [
    ...(isAdmin ? [{
      title: 'Add User',
      desc: 'PROVISION IDENTITY',
      icon: PersonAddAlt1,
      onClick: handleAddUser,
      color: '#10B981'
    }] : []),
    ...(isAdmin ? [{
      title: 'Directory',
      desc: 'CORPORATE SEARCH',
      icon: Dns,
      onClick: handleOpenDirectory,
      color: '#3B82F6'
    }] : []),
    ...(isAdmin ? [{
      title: 'Security Audit',
      desc: 'REVIEW LOGS',
      icon: Security,
      onClick: handleSecurityAudit,
      color: '#F59E0B'
    }] : []),
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
          {isAdminOrManager && (
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}
          {isAdmin && (
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
          )}
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddUser}
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
              New Employee
            </Button>
          )}
        </Stack>
      </Box>

      {/* Stats Grid - Admin/Manager Only */}
      {isAdminOrManager && (
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title} sx={{ animation: `fadeIn 0.5s ease-out ${0.2 + index * 0.1}s both` }}>
              <StatCard {...stat} />
            </Grid>
          ))}
          {isAdmin && (
            <Grid item xs={12} sm={6} md={3} sx={{ animation: 'fadeIn 0.5s ease-out 0.5s both' }}>
              <SecurityHealthCard score={calculateSecurityScore()} loading={analyticsLoading} />
            </Grid>
          )}
        </Grid>
      )}

      {/* Main Content Layout */}
      <Grid container spacing={4}>
        {/* Left Column: Recent Users - Admin Only */}
        {isAdmin && (
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
                  users.slice(0, 5).map((u) => (
                    <TableRow
                      key={u.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        '&:hover': { bgcolor: alpha('#0F172A', 0.02) }
                      }}
                      onClick={() => handleViewUser(u)}
                    >
                      <TableCell sx={{ py: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: u.is_active ? 'rgba(15, 23, 42, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                              color: u.is_active ? '#0F172A' : '#9CA3AF',
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
                          label={u.is_active ? 'ACTIVE' : 'INACTIVE'}
                          size="small"
                          sx={{
                            height: 20,
                            backgroundColor: u.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: u.is_active ? '#10B981' : '#EF4444',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            borderRadius: '4px',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <Stack direction="row" spacing={0.5}>
                          {u.roles && u.roles.length > 0 ? (
                            u.roles.slice(0, 2).map((role) => (
                              <Chip
                                key={role}
                                label={role.toUpperCase()}
                                size="small"
                                sx={{ height: 20, bgcolor: 'rgba(0, 0, 0, 0.05)', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 600, fontSize: '0.65rem' }}
                              />
                            ))
                          ) : (
                            <Chip
                              label="USER"
                              size="small"
                              sx={{ height: 20, bgcolor: 'rgba(0, 0, 0, 0.05)', color: 'rgba(0, 0, 0, 0.6)', fontWeight: 600, fontSize: '0.65rem' }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }} onClick={(e) => e.stopPropagation()}>
                        <UserActionsMenu
                          user={u}
                          onView={handleViewUser}
                          onEdit={handleEditUser}
                          onToggleActive={handleToggleActive}
                          onDelete={handleDeleteClick}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        )}

        {/* Right Column: Management Hub - Admin Only */}
        {isAdmin && managementHubItems.length > 0 && (
        <Grid item xs={12} lg={4}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.4)', fontWeight: 800, letterSpacing: '0.1em' }}>
              MANAGEMENT HUB
            </Typography>
          </Box>
          <Stack spacing={2}>
            {managementHubItems.map((item) => (
              <Card
                key={item.title}
                onClick={item.onClick}
                sx={{
                  border: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: '#F8FAFC',
                    borderColor: item.color,
                    boxShadow: `0 4px 12px ${alpha(item.color, 0.25)}`,
                    transform: 'translateY(-2px)',
                    '& .hub-icon': {
                      bgcolor: alpha(item.color, 0.1),
                      color: item.color,
                    }
                  }
                }}
              >
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    className="hub-icon"
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: '#FFFFFF',
                      color: '#0F172A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <item.icon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.925rem' }}>{item.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.65rem' }}>{item.desc}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Quick Stats Section */}
          {analytics && (
            <Card sx={{ mt: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF', borderRadius: 3, boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.4)', fontWeight: 800, letterSpacing: '0.1em', mb: 2, display: 'block' }}>
                  QUICK STATS
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>Avg. Tenure</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {analytics.average_tenure_years.toFixed(1)} years
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>Upcoming Reviews</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {analytics.upcoming_reviews}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>Remote Workers</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {analytics.remote_vs_onsite.remote}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

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
        )}
      </Grid>

      {/* Delete Confirmation Dialog - Admin Only */}
      {isAdmin && (
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{' '}
            <strong>{userToDelete?.first_name} {userToDelete?.last_name || userToDelete?.email}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={actionLoading}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      )}
    </Box>
  )
}
