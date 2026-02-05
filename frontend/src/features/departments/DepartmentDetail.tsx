import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  Skeleton,
  Divider,
  Paper,
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  People,
  LocationOn,
  AccountTree,
  AttachMoney,
  Person,
} from '@mui/icons-material'
import { departmentsApi } from '@/api/departments.api'
import { useAuth } from '@/hooks/useAuth'
import { ROLES } from '@/constants/roles'
import type { Department, DepartmentEmployeesResponse } from '@/types'

export const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  // Role-based access checks
  const isAdmin = hasRole(ROLES.ADMIN)

  const [department, setDepartment] = useState<Department | null>(null)
  const [employees, setEmployees] = useState<DepartmentEmployeesResponse['employees']>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const [deptRes, empRes] = await Promise.all([
          departmentsApi.getById(id),
          departmentsApi.getEmployees(id),
        ])
        setDepartment(deptRes.data.data || null)
        setEmployees(empRes.data.data?.employees || [])
      } catch (error) {
        console.error('Failed to fetch department:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={300} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={300} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Box>
    )
  }

  if (!department) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5">Department not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/departments')} sx={{ mt: 2 }}>
          Back to Departments
        </Button>
      </Box>
    )
  }

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
          onClick={() => navigate('/departments')}
          sx={{ mb: 2, color: '#64748B', fontWeight: 600 }}
        >
          Back to Departments
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Department Info Card */}
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
            <Box
              sx={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 800, mb: 1 }}>
                {department.name}
              </Typography>
              <Chip
                label={department.code}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              />
            </Box>

            <CardContent sx={{ p: 3 }}>
              {department.description && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    {department.description}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

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
                    <People sx={{ fontSize: 18, color: '#64748B' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Employees
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {department.employee_count || 0}
                    </Typography>
                  </Box>
                </Box>

                {department.location && (
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
                      <LocationOn sx={{ fontSize: 18, color: '#64748B' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Location
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {department.location}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {department.manager_name && (
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
                      <Person sx={{ fontSize: 18, color: '#64748B' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Department Head
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {department.manager_name}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {department.budget && (
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
                      <AttachMoney sx={{ fontSize: 18, color: '#64748B' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Budget
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        ${department.budget.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {department.parent_name && (
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
                      <AccountTree sx={{ fontSize: 18, color: '#64748B' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                        Parent Department
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                        {department.parent_name}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>

              {isAdmin && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/departments/${id}/edit`)}
                    sx={{
                      bgcolor: '#0F172A',
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#1a2236' },
                    }}
                  >
                    Edit Department
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Employees List */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              animation: 'fadeIn 0.5s ease-out 0.2s both',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Team Members ({employees.length})
              </Typography>

              {employees.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: 'rgba(15, 23, 42, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <People sx={{ fontSize: 32, color: '#64748B' }} />
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    No employees in this department yet
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {employees.map((emp) => (
                    <Grid item xs={12} sm={6} key={emp.id}>
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
                          '&:hover': {
                            bgcolor: 'rgba(15, 23, 42, 0.04)',
                            borderColor: '#0F172A',
                            transform: 'translateX(4px)',
                          },
                        }}
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        <Avatar
                          sx={{
                            bgcolor: '#0F172A',
                            width: 44,
                            height: 44,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                          }}
                        >
                          {emp.full_name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }} noWrap>
                            {emp.full_name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }} noWrap>
                            {emp.job_title}
                          </Typography>
                        </Box>
                        <Chip
                          label={emp.employee_id}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            bgcolor: 'rgba(0,0,0,0.06)',
                            color: '#64748B',
                          }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>

          {/* Sub-departments */}
          {department.children && department.children.length > 0 && (
            <Card
              sx={{
                mt: 3,
                borderRadius: 4,
                border: '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                animation: 'fadeIn 0.5s ease-out 0.3s both',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Sub-departments ({department.children.length})
                </Typography>
                <Grid container spacing={2}>
                  {department.children.map((child) => (
                    <Grid item xs={12} sm={6} md={4} key={child.id}>
                      <Paper
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          borderRadius: 2,
                          border: '1px solid rgba(0,0,0,0.06)',
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: '#0F172A', bgcolor: 'rgba(15, 23, 42, 0.02)' },
                        }}
                        onClick={() => navigate(`/departments/${child.id}`)}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {child.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {child.employee_count || 0} employees
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
