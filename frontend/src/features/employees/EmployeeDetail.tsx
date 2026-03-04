import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Stack,
  Divider,
  IconButton,
  Tab,
  Tabs,
  LinearProgress,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  alpha,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Slider,
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Work,
  School,
  EmojiEvents,
  PersonOutline,
  HomeWork,
  TrendingUp,
  Groups,
  Badge,
  AttachMoney,
  EventAvailable,
  Description,
  ContactPhone,
  Star,
  Flag,
  CheckCircle,
  Schedule,
  MoreVert,
  SwapHoriz,
  TrendingUpOutlined,
  Cancel,
  Add,
  Save,
  Close,
} from '@mui/icons-material'
import { employeesApi } from '@/api/employees.api'
import { departmentsApi } from '@/api/departments.api'
import { useAuth } from '@/hooks/useAuth'
import { ROLES } from '@/constants/roles'
import type { Employee, EmployeeListItem, EmploymentStatus, DepartmentListItem, Skill, PerformanceGoal } from '@/types'

const statusColors: Record<EmploymentStatus, { bg: string; color: string; label: string }> = {
  active: { bg: '#DCFCE7', color: '#16A34A', label: 'Active' },
  on_leave: { bg: '#FEF3C7', color: '#D97706', label: 'On Leave' },
  probation: { bg: '#DBEAFE', color: '#2563EB', label: 'Probation' },
  notice_period: { bg: '#FFEDD5', color: '#EA580C', label: 'Notice Period' },
  terminated: { bg: '#FEE2E2', color: '#DC2626', label: 'Terminated' },
  resigned: { bg: '#F3F4F6', color: '#6B7280', label: 'Resigned' },
  retired: { bg: '#EDE9FE', color: '#7C3AED', label: 'Retired' },
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
)

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 3,
      border: '1px solid rgba(0, 0, 0, 0.06)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography
        variant="overline"
        sx={{
          color: '#64748B',
          fontWeight: 700,
          letterSpacing: '0.1em',
          fontSize: '0.7rem',
          mb: 2,
          display: 'block',
        }}
      >
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
)

export const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hasRole, hasAnyRole } = useAuth()

  // Role-based access checks
  const isAdmin = hasRole(ROLES.ADMIN)
  const isAdminOrManager = hasAnyRole([ROLES.ADMIN, ROLES.MANAGER])

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [directReports, setDirectReports] = useState<EmployeeListItem[]>([])
  const [departments, setDepartments] = useState<DepartmentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Action menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Dialog states
  const [transferDialog, setTransferDialog] = useState(false)
  const [promoteDialog, setPromoteDialog] = useState(false)
  const [terminateDialog, setTerminateDialog] = useState(false)
  const [skillDialog, setSkillDialog] = useState(false)
  const [goalDialog, setGoalDialog] = useState(false)
  const [leaveDialog, setLeaveDialog] = useState(false)

  // Form data states
  const [transferData, setTransferData] = useState({ department_id: '', new_manager_id: '', effective_date: '', reason: '' })
  const [promoteData, setPromoteData] = useState({ new_job_title: '', new_job_level: '', new_salary: '', effective_date: '', reason: '' })
  const [terminateData, setTerminateData] = useState({ termination_date: '', reason: '', termination_type: 'resignation' })
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({ name: '', level: 'beginner', years_of_experience: 0 })
  const [newGoal, setNewGoal] = useState<Partial<PerformanceGoal>>({ title: '', description: '', target_date: '', progress_percentage: 0, status: 'not_started' })
  const [leaveUpdate, setLeaveUpdate] = useState({ leave_type: '', total_days: 0, used_days: 0, pending_days: 0 })

  const fetchEmployee = async () => {
    if (!id) return
    try {
      setLoading(true)
      const [empRes, reportsRes, deptRes] = await Promise.all([
        employeesApi.getById(id),
        employeesApi.getDirectReports(id),
        departmentsApi.list({ limit: 100 }),
      ])
      setEmployee(empRes.data.data || null)
      setDirectReports(reportsRes.data.data || [])
      setDepartments(deptRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch employee:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployee()
  }, [id])

  // Action handlers
  const handleTransfer = async () => {
    if (!id) return
    try {
      await employeesApi.transfer(id, {
        department_id: transferData.department_id,
        new_manager_id: transferData.new_manager_id || undefined,
        effective_date: transferData.effective_date,
        reason: transferData.reason,
      })
      setActionSuccess('Employee transferred successfully')
      setTransferDialog(false)
      fetchEmployee()
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to transfer employee')
    }
  }

  const handlePromote = async () => {
    if (!id) return
    try {
      await employeesApi.promote(id, {
        new_job_title: promoteData.new_job_title,
        new_job_level: promoteData.new_job_level || undefined,
        new_salary: promoteData.new_salary ? Number(promoteData.new_salary) : undefined,
        effective_date: promoteData.effective_date,
        reason: promoteData.reason,
      })
      setActionSuccess('Employee promoted successfully')
      setPromoteDialog(false)
      fetchEmployee()
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to promote employee')
    }
  }

  const handleTerminate = async () => {
    if (!id) return
    try {
      await employeesApi.terminate(id, {
        termination_date: terminateData.termination_date,
        reason: terminateData.reason,
        termination_type: terminateData.termination_type as 'resignation' | 'termination' | 'retirement' | 'layoff',
      })
      setActionSuccess('Employee terminated successfully')
      setTerminateDialog(false)
      fetchEmployee()
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to terminate employee')
    }
  }

  const handleAddSkill = async () => {
    if (!id || !employee) return
    try {
      const updatedSkills = [...(employee.skills || []), newSkill as Skill]
      await employeesApi.updateSkills(id, updatedSkills)
      setActionSuccess('Skill added successfully')
      setSkillDialog(false)
      setNewSkill({ name: '', level: 'beginner', years_of_experience: 0 })
      fetchEmployee()
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to add skill')
    }
  }

  const handleAddGoal = async () => {
    if (!id) return
    try {
      await employeesApi.addPerformanceGoal(id, {
        title: newGoal.title!,
        description: newGoal.description,
        target_date: newGoal.target_date!,
        progress_percentage: newGoal.progress_percentage || 0,
        status: newGoal.status as 'not_started' | 'in_progress' | 'completed' | 'cancelled',
      })
      setActionSuccess('Goal added successfully')
      setGoalDialog(false)
      setNewGoal({ title: '', description: '', target_date: '', progress_percentage: 0, status: 'not_started' })
      fetchEmployee()
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to add goal')
    }
  }

  const handleUpdateLeave = async () => {
    if (!id) return
    try {
      await employeesApi.updateLeaveBalance(id, leaveUpdate.leave_type, {
        total_days: leaveUpdate.total_days,
        used_days: leaveUpdate.used_days,
        pending_days: leaveUpdate.pending_days,
      })
      setActionSuccess('Leave balance updated successfully')
      setLeaveDialog(false)
      fetchEmployee()
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to update leave balance')
    }
  }

  if (loading) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={40} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  if (!employee) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5">Employee not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/employees')} sx={{ mt: 2 }}>
          Back to Employees
        </Button>
      </Box>
    )
  }

  const status = statusColors[employee.employment_status]

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
          sx={{
            mb: 2,
            color: '#64748B',
            fontWeight: 600,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
          }}
        >
          Back to Employees
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Profile Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              animation: 'fadeIn 0.5s ease-out 0.1s both',
            }}
          >
            {/* Profile Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
                pt: 4,
                pb: 8,
                px: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 60,
                  background: 'linear-gradient(to top, #FFFFFF, transparent)',
                },
              }}
            >
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Chip
                  label={status.label}
                  sx={{
                    bgcolor: status.bg,
                    color: status.color,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            </Box>

            <CardContent sx={{ pt: 0, pb: 4, px: 3, mt: -6, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={employee.profile_picture_url}
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    border: '4px solid #FFFFFF',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    mb: 2,
                  }}
                >
                  {employee.first_name?.[0]}{employee.last_name?.[0]}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                  {employee.full_name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                  {employee.employee_id}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                  {employee.job_title}
                </Typography>
                {employee.department && (
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    {employee.department.name}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Contact Info */}
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: 'rgba(15, 23, 42, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Email sx={{ fontSize: 18, color: '#64748B' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                      Work Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 500 }}>
                      {employee.work_email}
                    </Typography>
                  </Box>
                </Box>

                {employee.work_phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: 'rgba(15, 23, 42, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Phone sx={{ fontSize: 18, color: '#64748B' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                        Work Phone
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 500 }}>
                        {employee.work_phone}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: 'rgba(15, 23, 42, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {employee.is_remote ? <HomeWork sx={{ fontSize: 18, color: '#64748B' }} /> : <LocationOn sx={{ fontSize: 18, color: '#64748B' }} />}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 500 }}>
                      {employee.is_remote ? 'Remote' : employee.work_location || 'Office'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: 'rgba(15, 23, 42, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CalendarToday sx={{ fontSize: 18, color: '#64748B' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                      Joined
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 500 }}>
                      {new Date(employee.hire_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {isAdminOrManager && (
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/employees/${id}/edit`)}
                    sx={{
                      bgcolor: '#0F172A',
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#1a2236' },
                    }}
                  >
                    Edit Profile
                  </Button>
                  {isAdmin && (
                    <IconButton
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  )}
                </Box>
              )}

              {/* Action Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { borderRadius: 2, minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' } }}
              >
                <MenuItem onClick={() => { setAnchorEl(null); setTransferDialog(true) }}>
                  <SwapHoriz sx={{ mr: 1.5, fontSize: 20, color: '#3B82F6' }} />
                  Transfer
                </MenuItem>
                <MenuItem onClick={() => { setAnchorEl(null); setPromoteDialog(true) }}>
                  <TrendingUpOutlined sx={{ mr: 1.5, fontSize: 20, color: '#10B981' }} />
                  Promote
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { setAnchorEl(null); setTerminateDialog(true) }} sx={{ color: '#EF4444' }}>
                  <Cancel sx={{ mr: 1.5, fontSize: 20 }} />
                  Terminate
                </MenuItem>
              </Menu>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card
            sx={{
              mt: 3,
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              animation: 'fadeIn 0.5s ease-out 0.2s both',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(15, 23, 42, 0.04)', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {employee.years_of_service}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                      Years
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(15, 23, 42, 0.04)', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {employee.direct_reports_count || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                      Reports
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Tabs Content */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              animation: 'fadeIn 0.5s ease-out 0.15s both',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{
                  px: 3,
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 56,
                    '&.Mui-selected': { color: '#0F172A' },
                  },
                  '& .MuiTabs-indicator': { bgcolor: '#0F172A', height: 3, borderRadius: '3px 3px 0 0' },
                }}
              >
                <Tab label="Overview" />
                <Tab label="Skills & Education" />
                <Tab label="Performance" />
                <Tab label="Leave & Documents" />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              {/* Overview Tab */}
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  {/* Employment Info */}
                  <Grid item xs={12} md={6}>
                    <InfoCard title="Employment Information">
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Employment Type</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {employee.employment_type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Job Level</Typography>
                          <Typography variant="body2" fontWeight={600}>{employee.job_level || '—'}</Typography>
                        </Box>
                        {employee.manager && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Reports To</Typography>
                            <Typography variant="body2" fontWeight={600}>{employee.manager.full_name}</Typography>
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Work Schedule</Typography>
                          <Typography variant="body2" fontWeight={600}>{employee.work_schedule || 'Standard'}</Typography>
                        </Box>
                      </Stack>
                    </InfoCard>
                  </Grid>

                  {/* Personal Info */}
                  <Grid item xs={12} md={6}>
                    <InfoCard title="Personal Information">
                      <Stack spacing={2}>
                        {employee.date_of_birth && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {new Date(employee.date_of_birth).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                        {employee.gender && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Gender</Typography>
                            <Typography variant="body2" fontWeight={600}>{employee.gender}</Typography>
                          </Box>
                        )}
                        {employee.nationality && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Nationality</Typography>
                            <Typography variant="body2" fontWeight={600}>{employee.nationality}</Typography>
                          </Box>
                        )}
                        {employee.marital_status && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Marital Status</Typography>
                            <Typography variant="body2" fontWeight={600}>{employee.marital_status}</Typography>
                          </Box>
                        )}
                      </Stack>
                    </InfoCard>
                  </Grid>

                  {/* Emergency Contacts */}
                  {employee.emergency_contacts && employee.emergency_contacts.length > 0 && (
                    <Grid item xs={12}>
                      <InfoCard title="Emergency Contacts">
                        <Grid container spacing={2}>
                          {employee.emergency_contacts.map((contact, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                              <Paper
                                sx={{
                                  p: 2,
                                  bgcolor: contact.is_primary ? 'rgba(16, 185, 129, 0.06)' : 'rgba(0,0,0,0.02)',
                                  border: contact.is_primary ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(0,0,0,0.06)',
                                  borderRadius: 2,
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="body2" fontWeight={700}>{contact.name}</Typography>
                                  {contact.is_primary && (
                                    <Chip label="Primary" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#10B981', color: '#FFF' }} />
                                  )}
                                </Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {contact.relationship}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>{contact.phone}</Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </InfoCard>
                    </Grid>
                  )}

                  {/* Direct Reports */}
                  {directReports.length > 0 && (
                    <Grid item xs={12}>
                      <InfoCard title={`Direct Reports (${directReports.length})`}>
                        <Grid container spacing={2}>
                          {directReports.slice(0, 4).map((report) => (
                            <Grid item xs={12} sm={6} key={report.id}>
                              <Paper
                                sx={{
                                  p: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  cursor: 'pointer',
                                  borderRadius: 2,
                                  border: '1px solid rgba(0,0,0,0.06)',
                                  transition: 'all 0.2s',
                                  '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.04)', borderColor: '#0F172A' },
                                }}
                                onClick={() => navigate(`/employees/${report.id}`)}
                              >
                                <Avatar sx={{ bgcolor: '#0F172A', width: 40, height: 40, fontSize: '0.875rem' }}>
                                  {report.first_name?.[0]}{report.last_name?.[0]}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>{report.full_name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{report.job_title}</Typography>
                                </Box>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </InfoCard>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>

              {/* Skills Tab */}
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  {/* Skills */}
                  <Grid item xs={12}>
                    <InfoCard title="Skills & Competencies">
                      {isAdminOrManager && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => setSkillDialog(true)}
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                          >
                            Add Skill
                          </Button>
                        </Box>
                      )}
                      {employee.skills && employee.skills.length > 0 ? (
                        <Grid container spacing={2}>
                          {employee.skills.map((skill, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2" fontWeight={600}>{skill.name}</Typography>
                                  {skill.certified && (
                                    <Tooltip title="Certified">
                                      <EmojiEvents sx={{ fontSize: 16, color: '#F59E0B' }} />
                                    </Tooltip>
                                  )}
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={skill.level === 'expert' ? 100 : skill.level === 'advanced' ? 75 : skill.level === 'intermediate' ? 50 : 25}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(15, 23, 42, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      bgcolor: '#0F172A',
                                    },
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                  {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                                  {skill.years_of_experience && ` • ${skill.years_of_experience} years`}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No skills recorded</Typography>
                      )}
                    </InfoCard>
                  </Grid>

                  {/* Certifications */}
                  <Grid item xs={12} md={6}>
                    <InfoCard title="Certifications">
                      {employee.certifications && employee.certifications.length > 0 ? (
                        <Stack spacing={2}>
                          {employee.certifications.map((cert, i) => (
                            <Paper key={i} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                              <Typography variant="body2" fontWeight={600}>{cert.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{cert.issuer}</Typography>
                              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Issued: {new Date(cert.issue_date).toLocaleDateString()}
                                {cert.expiry_date && ` • Expires: ${new Date(cert.expiry_date).toLocaleDateString()}`}
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No certifications</Typography>
                      )}
                    </InfoCard>
                  </Grid>

                  {/* Education */}
                  <Grid item xs={12} md={6}>
                    <InfoCard title="Education">
                      {employee.education && employee.education.length > 0 ? (
                        <Stack spacing={2}>
                          {employee.education.map((edu, i) => (
                            <Paper key={i} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                              <Typography variant="body2" fontWeight={600}>{edu.degree}</Typography>
                              <Typography variant="caption" color="text.secondary">{edu.field_of_study}</Typography>
                              <Typography variant="caption" display="block">{edu.institution}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {edu.start_date} - {edu.end_date || 'Present'}
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No education records</Typography>
                      )}
                    </InfoCard>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Performance Tab */}
              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                  {/* Performance Rating */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, textAlign: 'center', borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.04)' }}>
                      <Typography variant="overline" color="text.secondary">Last Rating</Typography>
                      <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F172A', my: 1 }}>
                        {employee.last_performance_rating?.toFixed(1) || '—'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            sx={{
                              fontSize: 20,
                              color: star <= (employee.last_performance_rating || 0) ? '#F59E0B' : '#E2E8F0',
                            }}
                          />
                        ))}
                      </Box>
                      {employee.last_review_date && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Last review: {new Date(employee.last_review_date).toLocaleDateString()}
                        </Typography>
                      )}
                    </Card>
                  </Grid>

                  {/* Performance Goals */}
                  <Grid item xs={12} md={8}>
                    <InfoCard title="Performance Goals">
                      {isAdminOrManager && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => setGoalDialog(true)}
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                          >
                            Add Goal
                          </Button>
                        </Box>
                      )}
                      {employee.performance_goals && employee.performance_goals.length > 0 ? (
                        <Stack spacing={2}>
                          {employee.performance_goals.map((goal) => (
                            <Paper key={goal.id} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>{goal.title}</Typography>
                                  <Typography variant="caption" color="text.secondary">{goal.description}</Typography>
                                </Box>
                                <Chip
                                  size="small"
                                  label={goal.status.replace('_', ' ')}
                                  sx={{
                                    height: 22,
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    bgcolor: goal.status === 'completed' ? '#DCFCE7' : goal.status === 'in_progress' ? '#DBEAFE' : '#F3F4F6',
                                    color: goal.status === 'completed' ? '#16A34A' : goal.status === 'in_progress' ? '#2563EB' : '#6B7280',
                                  }}
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={goal.progress_percentage}
                                  sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.08)' }}
                                />
                                <Typography variant="caption" fontWeight={600}>{goal.progress_percentage}%</Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Due: {new Date(goal.target_date).toLocaleDateString()}
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No goals set</Typography>
                      )}
                    </InfoCard>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Leave & Documents Tab */}
              <TabPanel value={tabValue} index={3}>
                <Grid container spacing={3}>
                  {/* Leave Balances */}
                  <Grid item xs={12} md={6}>
                    <InfoCard title="Leave Balances">
                      {isAdminOrManager && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => setLeaveDialog(true)}
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                          >
                            Update Balance
                          </Button>
                        </Box>
                      )}
                      {employee.leave_balances && employee.leave_balances.length > 0 ? (
                        <Stack spacing={2}>
                          {employee.leave_balances.map((leave, i) => (
                            <Box key={i}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" fontWeight={600}>{leave.leave_type}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {leave.total_days - leave.used_days - leave.pending_days} days left
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(leave.used_days / leave.total_days) * 100}
                                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.08)' }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {leave.used_days} used • {leave.pending_days} pending • {leave.total_days} total
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No leave balances set</Typography>
                      )}
                    </InfoCard>
                  </Grid>

                  {/* Documents */}
                  <Grid item xs={12} md={6}>
                    <InfoCard title="Documents">
                      {employee.documents && employee.documents.length > 0 ? (
                        <List dense>
                          {employee.documents.map((doc, i) => (
                            <ListItem
                              key={i}
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                border: '1px solid rgba(0,0,0,0.06)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                              }}
                            >
                              <ListItemIcon>
                                <Description sx={{ color: '#64748B' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={doc.name}
                                secondary={doc.type}
                                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                              />
                              {doc.verified && (
                                <Tooltip title="Verified">
                                  <CheckCircle sx={{ color: '#10B981', fontSize: 20 }} />
                                </Tooltip>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">No documents uploaded</Typography>
                      )}
                    </InfoCard>
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Success/Error Alerts */}
      {actionSuccess && (
        <Alert
          severity="success"
          onClose={() => setActionSuccess(null)}
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          {actionSuccess}
        </Alert>
      )}
      {actionError && (
        <Alert
          severity="error"
          onClose={() => setActionError(null)}
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          {actionError}
        </Alert>
      )}

      {/* Transfer Dialog */}
      <Dialog open={transferDialog} onClose={() => setTransferDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Transfer Employee</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>New Department</InputLabel>
              <Select
                value={transferData.department_id}
                label="New Department"
                onChange={(e) => setTransferData(prev => ({ ...prev, department_id: e.target.value }))}
              >
                {departments.map(d => (
                  <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Effective Date"
              InputLabelProps={{ shrink: true }}
              value={transferData.effective_date}
              onChange={(e) => setTransferData(prev => ({ ...prev, effective_date: e.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason"
              value={transferData.reason}
              onChange={(e) => setTransferData(prev => ({ ...prev, reason: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTransferDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleTransfer}
            disabled={!transferData.department_id || !transferData.effective_date}
            sx={{ bgcolor: '#0F172A', fontWeight: 600, '&:hover': { bgcolor: '#1a2236' } }}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Promote Dialog */}
      <Dialog open={promoteDialog} onClose={() => setPromoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Promote Employee</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="New Job Title"
              value={promoteData.new_job_title}
              onChange={(e) => setPromoteData(prev => ({ ...prev, new_job_title: e.target.value }))}
            />
            <TextField
              fullWidth
              label="New Job Level"
              value={promoteData.new_job_level}
              onChange={(e) => setPromoteData(prev => ({ ...prev, new_job_level: e.target.value }))}
            />
            <TextField
              fullWidth
              type="number"
              label="New Salary"
              value={promoteData.new_salary}
              onChange={(e) => setPromoteData(prev => ({ ...prev, new_salary: e.target.value }))}
            />
            <TextField
              fullWidth
              type="date"
              label="Effective Date"
              InputLabelProps={{ shrink: true }}
              value={promoteData.effective_date}
              onChange={(e) => setPromoteData(prev => ({ ...prev, effective_date: e.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Reason"
              value={promoteData.reason}
              onChange={(e) => setPromoteData(prev => ({ ...prev, reason: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPromoteDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePromote}
            disabled={!promoteData.new_job_title || !promoteData.effective_date}
            sx={{ bgcolor: '#10B981', fontWeight: 600, '&:hover': { bgcolor: '#059669' } }}
          >
            Promote
          </Button>
        </DialogActions>
      </Dialog>

      {/* Terminate Dialog */}
      <Dialog open={terminateDialog} onClose={() => setTerminateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#EF4444' }}>Terminate Employee</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            This action will mark the employee as terminated. Please ensure all necessary offboarding steps are completed.
          </Alert>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Termination Type</InputLabel>
              <Select
                value={terminateData.termination_type}
                label="Termination Type"
                onChange={(e) => setTerminateData(prev => ({ ...prev, termination_type: e.target.value }))}
              >
                <MenuItem value="resignation">Resignation</MenuItem>
                <MenuItem value="termination">Termination</MenuItem>
                <MenuItem value="retirement">Retirement</MenuItem>
                <MenuItem value="layoff">Layoff</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Termination Date"
              InputLabelProps={{ shrink: true }}
              value={terminateData.termination_date}
              onChange={(e) => setTerminateData(prev => ({ ...prev, termination_date: e.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason"
              value={terminateData.reason}
              onChange={(e) => setTerminateData(prev => ({ ...prev, reason: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setTerminateDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleTerminate}
            disabled={!terminateData.termination_date || !terminateData.reason}
            sx={{ bgcolor: '#EF4444', fontWeight: 600, '&:hover': { bgcolor: '#DC2626' } }}
          >
            Confirm Termination
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={skillDialog} onClose={() => setSkillDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Skill</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React, Python, Project Management"
            />
            <FormControl fullWidth>
              <InputLabel>Proficiency Level</InputLabel>
              <Select
                value={newSkill.level}
                label="Proficiency Level"
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as Skill['level'] }))}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="Years of Experience"
              value={newSkill.years_of_experience}
              onChange={(e) => setNewSkill(prev => ({ ...prev, years_of_experience: Number(e.target.value) }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSkillDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSkill}
            disabled={!newSkill.name}
            startIcon={<Save />}
            sx={{ bgcolor: '#0F172A', fontWeight: 600, '&:hover': { bgcolor: '#1a2236' } }}
          >
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Goal Dialog */}
      <Dialog open={goalDialog} onClose={() => setGoalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Performance Goal</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Goal Title"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              fullWidth
              type="date"
              label="Target Date"
              InputLabelProps={{ shrink: true }}
              value={newGoal.target_date}
              onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newGoal.status}
                label="Status"
                onChange={(e) => setNewGoal(prev => ({ ...prev, status: e.target.value as PerformanceGoal['status'] }))}
              >
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="body2" gutterBottom>Progress: {newGoal.progress_percentage}%</Typography>
              <Slider
                value={newGoal.progress_percentage}
                onChange={(_, v) => setNewGoal(prev => ({ ...prev, progress_percentage: v as number }))}
                valueLabelDisplay="auto"
                sx={{ color: '#0F172A' }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setGoalDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddGoal}
            disabled={!newGoal.title || !newGoal.target_date}
            startIcon={<Save />}
            sx={{ bgcolor: '#0F172A', fontWeight: 600, '&:hover': { bgcolor: '#1a2236' } }}
          >
            Add Goal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Leave Balance Dialog */}
      <Dialog open={leaveDialog} onClose={() => setLeaveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Leave Balance</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={leaveUpdate.leave_type}
                label="Leave Type"
                onChange={(e) => setLeaveUpdate(prev => ({ ...prev, leave_type: e.target.value }))}
              >
                <MenuItem value="Annual">Annual Leave</MenuItem>
                <MenuItem value="Sick">Sick Leave</MenuItem>
                <MenuItem value="Personal">Personal Leave</MenuItem>
                <MenuItem value="Maternity">Maternity Leave</MenuItem>
                <MenuItem value="Paternity">Paternity Leave</MenuItem>
                <MenuItem value="Unpaid">Unpaid Leave</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="Total Days"
              value={leaveUpdate.total_days}
              onChange={(e) => setLeaveUpdate(prev => ({ ...prev, total_days: Number(e.target.value) }))}
            />
            <TextField
              fullWidth
              type="number"
              label="Used Days"
              value={leaveUpdate.used_days}
              onChange={(e) => setLeaveUpdate(prev => ({ ...prev, used_days: Number(e.target.value) }))}
            />
            <TextField
              fullWidth
              type="number"
              label="Pending Days"
              value={leaveUpdate.pending_days}
              onChange={(e) => setLeaveUpdate(prev => ({ ...prev, pending_days: Number(e.target.value) }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setLeaveDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateLeave}
            disabled={!leaveUpdate.leave_type}
            startIcon={<Save />}
            sx={{ bgcolor: '#0F172A', fontWeight: 600, '&:hover': { bgcolor: '#1a2236' } }}
          >
            Update Balance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
