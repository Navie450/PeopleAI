import { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Stack,
  Pagination,
  Menu,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Skeleton,
  alpha,
  Fade,
} from '@mui/material'
import {
  Search,
  PersonAdd,
  GridView,
  TableRows,
  MoreVert,
  Edit,
  Delete,
  TrendingUp,
  SwapHoriz,
  Badge,
  WorkOutline,
  LocationOn,
  HomeWork,
  AccountTree,
  Analytics,
} from '@mui/icons-material'
import { employeesApi } from '@/api/employees.api'
import { departmentsApi } from '@/api/departments.api'
import { useNavigate } from 'react-router-dom'
import type { EmployeeListItem, EmploymentStatus, EmploymentType, DepartmentListItem } from '@/types'

const statusColors: Record<EmploymentStatus, { bg: string; color: string }> = {
  active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' },
  on_leave: { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' },
  probation: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' },
  notice_period: { bg: 'rgba(249, 115, 22, 0.1)', color: '#F97316' },
  terminated: { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' },
  resigned: { bg: 'rgba(156, 163, 175, 0.1)', color: '#6B7280' },
  retired: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' },
}

const typeLabels: Record<EmploymentType, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  intern: 'Intern',
  freelance: 'Freelance',
  temporary: 'Temporary',
}

// Common skill options for filtering
const skillOptions = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Project Management',
  'Leadership', 'Communication', 'Data Analysis', 'Machine Learning'
]

export const EmployeeList = () => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<EmployeeListItem[]>([])
  const [departments, setDepartments] = useState<DepartmentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [skillFilter, setSkillFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeListItem | null>(null)

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)

      // Use skill-based search if skill filter is active
      if (skillFilter !== 'all') {
        const { data } = await employeesApi.getBySkill(skillFilter)
        setEmployees(data.data || [])
        setTotalPages(1)
        return
      }

      // Use search API for text search
      if (searchQuery && searchQuery.length >= 2) {
        const { data } = await employeesApi.search(searchQuery, 50)
        let results = data.data || []

        // Apply client-side filters on search results
        if (statusFilter !== 'all') {
          results = results.filter(e => e.employment_status === statusFilter)
        }
        if (departmentFilter !== 'all') {
          results = results.filter(e => e.department?.id === departmentFilter)
        }
        if (typeFilter !== 'all') {
          results = results.filter(e => e.employment_type === typeFilter)
        }

        setEmployees(results)
        setTotalPages(1)
        return
      }

      // Default list with filters
      const params: Record<string, unknown> = { page, limit: 12 }
      if (statusFilter !== 'all') params.employment_status = statusFilter
      if (departmentFilter !== 'all') params.department_id = departmentFilter
      if (typeFilter !== 'all') params.employment_type = typeFilter

      const { data } = await employeesApi.list(params)
      setEmployees(data.data || [])
      setTotalPages(data.meta?.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, statusFilter, departmentFilter, typeFilter, skillFilter])

  const fetchDepartments = async () => {
    try {
      const { data } = await departmentsApi.list({ limit: 100 })
      setDepartments(data.data || [])
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: EmployeeListItem) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedEmployee(employee)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedEmployee(null)
  }

  const handleEdit = () => {
    if (selectedEmployee) {
      navigate(`/employees/${selectedEmployee.id}/edit`)
    }
    handleMenuClose()
  }

  const handlePromote = () => {
    if (selectedEmployee) {
      navigate(`/employees/${selectedEmployee.id}/promote`)
    }
    handleMenuClose()
  }

  const handleTransfer = () => {
    if (selectedEmployee) {
      navigate(`/employees/${selectedEmployee.id}/transfer`)
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (selectedEmployee && window.confirm('Are you sure you want to remove this employee?')) {
      try {
        await employeesApi.delete(selectedEmployee.id)
        fetchEmployees()
      } catch (error) {
        console.error('Failed to delete employee:', error)
      }
    }
    handleMenuClose()
  }

  const EmployeeCard = ({ employee, index }: { employee: EmployeeListItem; index: number }) => (
    <Fade in timeout={300 + index * 50}>
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            borderColor: '#0F172A',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
            '& .employee-avatar': {
              transform: 'scale(1.1)',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.3)',
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #0F172A 0%, #3B82F6 50%, #8B5CF6 100%)',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.3)',
          },
        }}
        onClick={() => navigate(`/employees/${employee.id}`)}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
            <Avatar
              className="employee-avatar"
              src={employee.profile_picture_url}
              sx={{
                bgcolor: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#FFFFFF',
                width: 56,
                height: 56,
                fontSize: '1.25rem',
                fontWeight: 700,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              }}
            >
              {employee.first_name?.[0]}{employee.last_name?.[0]}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h3"
                    noWrap
                    sx={{ mb: 0.25, fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}
                  >
                    {employee.full_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}
                  >
                    {employee.employee_id}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, employee)}
                  sx={{
                    ml: 1,
                    color: 'rgba(0, 0, 0, 0.4)',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)', color: '#0F172A' },
                  }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WorkOutline sx={{ fontSize: 16, color: '#64748B' }} />
              <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.875rem' }}>
                {employee.job_title}
              </Typography>
            </Box>
            {employee.department && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Badge sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                  {employee.department.name}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {employee.is_remote ? (
                <HomeWork sx={{ fontSize: 16, color: '#64748B' }} />
              ) : (
                <LocationOn sx={{ fontSize: 16, color: '#64748B' }} />
              )}
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                {employee.is_remote ? 'Remote' : employee.work_location || 'Office'}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label={employee.employment_status.replace('_', ' ').toUpperCase()}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.65rem',
                height: 22,
                borderRadius: '6px',
                bgcolor: statusColors[employee.employment_status]?.bg || 'rgba(0,0,0,0.1)',
                color: statusColors[employee.employment_status]?.color || '#000',
              }}
            />
            <Chip
              label={typeLabels[employee.employment_type]}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 600,
                fontSize: '0.65rem',
                height: 22,
                borderRadius: '6px',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                color: '#64748B',
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Fade>
  )

  return (
    <Box
      sx={{
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              mb: 0.5,
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 800,
              color: '#0F172A',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Employees
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
            Manage your workforce and employee profiles
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Analytics />}
            onClick={() => navigate('/employees/analytics')}
            sx={{
              borderColor: '#E2E8F0',
              color: '#475569',
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { borderColor: '#0F172A', bgcolor: 'rgba(15, 23, 42, 0.04)' },
            }}
          >
            Analytics
          </Button>
          <Button
            variant="outlined"
            startIcon={<AccountTree />}
            onClick={() => navigate('/employees/org-chart')}
            sx={{
              borderColor: '#E2E8F0',
              color: '#475569',
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { borderColor: '#0F172A', bgcolor: 'rgba(15, 23, 42, 0.04)' },
            }}
          >
            Org Chart
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/employees/new')}
            sx={{
              bgcolor: '#0F172A',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              '&:hover': {
                bgcolor: '#1a2236',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)',
              },
              transition: 'all 0.2s',
            }}
          >
            Add Employee
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 4,
          animation: 'fadeInUp 0.5s ease-out 0.1s both',
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F1F5F9',
                    borderRadius: 50,
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#0F172A' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#94A3B8' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControl
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F1F5F9',
                    borderRadius: 50,
                    '& fieldset': { borderColor: '#E2E8F0' },
                  },
                }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                  <MenuItem value="probation">Probation</MenuItem>
                  <MenuItem value="notice_period">Notice Period</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControl
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F1F5F9',
                    borderRadius: 50,
                    '& fieldset': { borderColor: '#E2E8F0' },
                  },
                }}
              >
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  label="Department"
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControl
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F1F5F9',
                    borderRadius: 50,
                    '& fieldset': { borderColor: '#E2E8F0' },
                  },
                }}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="full_time">Full Time</MenuItem>
                  <MenuItem value="part_time">Part Time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="intern">Intern</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <FormControl
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: skillFilter !== 'all' ? 'rgba(139, 92, 246, 0.1)' : '#F1F5F9',
                    borderRadius: 50,
                    '& fieldset': { borderColor: skillFilter !== 'all' ? '#8B5CF6' : '#E2E8F0' },
                  },
                }}
              >
                <InputLabel>Skill</InputLabel>
                <Select
                  value={skillFilter}
                  label="Skill"
                  onChange={(e) => { setSkillFilter(e.target.value); setPage(1) }}
                >
                  <MenuItem value="all">All Skills</MenuItem>
                  {skillOptions.map(skill => (
                    <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={12} md={1}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                size="small"
                fullWidth
                sx={{
                  bgcolor: '#F1F5F9',
                  borderRadius: 50,
                  p: 0.5,
                  '& .MuiToggleButton-root': {
                    color: '#64748B',
                    border: 'none',
                    borderRadius: 50,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: '#FFFFFF',
                      color: '#0F172A',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: '#FFFFFF' },
                    },
                  },
                }}
              >
                <ToggleButton value="grid">
                  <Tooltip title="Grid View">
                    <GridView fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="table">
                  <Tooltip title="Table View">
                    <TableRows fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Employee Count */}
      <Box sx={{ mb: 3, animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Main Content */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Skeleton variant="circular" width={56} height={56} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={28} />
                      <Skeleton variant="text" width="50%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="50%" />
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Skeleton variant="rounded" width={80} height={22} />
                    <Skeleton variant="rounded" width={70} height={22} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : employees.length === 0 ? (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(15, 23, 42, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <PersonAdd sx={{ fontSize: 40, color: '#0F172A' }} />
            </Box>
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
              No employees found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first employee
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/employees/new')}
              sx={{
                bgcolor: '#0F172A',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#1a2236' },
              }}
            >
              Add Your First Employee
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3} sx={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
              {employees.map((employee, index) => (
                <Grid item xs={12} sm={6} md={4} key={employee.id}>
                  <EmployeeCard employee={employee} index={index} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                animation: 'fadeInUp 0.5s ease-out 0.3s both',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#0F172A' }}>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', py: 2 }}>
                      Employee
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Job Title
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow
                      key={emp.id}
                      hover
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: alpha('#0F172A', 0.02) },
                        '&:last-child td': { border: 0 },
                      }}
                    >
                      <TableCell sx={{ py: 2, borderBottom: '1px solid #F1F5F9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={emp.profile_picture_url}
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: '#0F172A',
                              color: '#FFFFFF',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                            }}
                          >
                            {emp.first_name?.[0]}{emp.last_name?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                              {emp.full_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              {emp.employee_id} &bull; {emp.work_email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Typography variant="body2" sx={{ color: '#475569' }}>
                          {emp.department?.name || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 500 }}>
                          {emp.job_title}
                        </Typography>
                        {emp.job_level && (
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            {emp.job_level}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip
                          label={emp.employment_status.replace('_', ' ').toUpperCase()}
                          size="small"
                          sx={{
                            height: 22,
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            borderRadius: '6px',
                            bgcolor: statusColors[emp.employment_status]?.bg,
                            color: statusColors[emp.employment_status]?.color,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {emp.is_remote ? (
                            <HomeWork sx={{ fontSize: 16, color: '#64748B' }} />
                          ) : (
                            <LocationOn sx={{ fontSize: 16, color: '#64748B' }} />
                          )}
                          <Typography variant="body2" sx={{ color: '#64748B' }}>
                            {emp.is_remote ? 'Remote' : emp.work_location || 'Office'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, emp)}
                          sx={{ color: '#94A3B8' }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#64748B',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    bgcolor: '#0F172A',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: '#1a2236' },
                  },
                  '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.08)' },
                },
              }}
            />
          </Box>
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.08)',
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: '#475569' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Edit Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePromote} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <TrendingUp fontSize="small" sx={{ color: '#10B981' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Promote</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleTransfer} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <SwapHoriz fontSize="small" sx={{ color: '#3B82F6' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Transfer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ py: 1.5, color: '#EF4444' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#EF4444' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Remove</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
