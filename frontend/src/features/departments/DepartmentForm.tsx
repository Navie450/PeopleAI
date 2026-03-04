import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { departmentsApi } from '@/api/departments.api'
import { employeesApi } from '@/api/employees.api'
import type { CreateDepartmentDto, UpdateDepartmentDto, DepartmentListItem, EmployeeListItem } from '@/types'

interface DepartmentFormProps {
  mode: 'create' | 'edit'
}

export const DepartmentForm = ({ mode }: DepartmentFormProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [departments, setDepartments] = useState<DepartmentListItem[]>([])
  const [managers, setManagers] = useState<EmployeeListItem[]>([])

  const [formData, setFormData] = useState<CreateDepartmentDto & { is_active?: boolean }>({
    name: '',
    code: '',
    description: '',
    parent_id: '',
    manager_id: '',
    location: '',
    budget: undefined,
    is_active: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments for parent selection
        const deptRes = await departmentsApi.list({ limit: 100 })
        setDepartments(deptRes.data.data || [])

        // Fetch employees for manager selection
        const empRes = await employeesApi.list({ limit: 100, employment_status: 'active' })
        setManagers(empRes.data.data || [])

        // Fetch department data for edit mode
        if (mode === 'edit' && id) {
          const detailRes = await departmentsApi.getById(id)
          const dept = detailRes.data.data
          if (dept) {
            setFormData({
              name: dept.name,
              code: dept.code,
              description: dept.description || '',
              parent_id: dept.parent_id || '',
              manager_id: dept.manager_id || '',
              location: dept.location || '',
              budget: dept.budget,
              is_active: dept.is_active,
            })
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [mode, id])

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      setError(null)

      const submitData: CreateDepartmentDto | UpdateDepartmentDto = {
        ...formData,
        parent_id: formData.parent_id || undefined,
        manager_id: formData.manager_id || undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
      }

      if (mode === 'create') {
        await departmentsApi.create(submitData as CreateDepartmentDto)
      } else if (id) {
        await departmentsApi.update(id, submitData as UpdateDepartmentDto)
      }

      navigate('/departments')
    } catch (err: any) {
      console.error('Failed to save department:', err)
      setError(err.response?.data?.message || 'Failed to save department')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
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
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
          {mode === 'create' ? 'Create Department' : 'Edit Department'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
          {mode === 'create' ? 'Add a new department to your organization' : 'Update department information'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          animation: 'fadeIn 0.5s ease-out 0.1s both',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department Name *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Engineering"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department Code *"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                placeholder="e.g., ENG"
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of the department's role and responsibilities"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Department</InputLabel>
                <Select
                  value={formData.parent_id}
                  label="Parent Department"
                  onChange={(e) => handleChange('parent_id', e.target.value)}
                >
                  <MenuItem value="">None (Top Level)</MenuItem>
                  {departments
                    .filter((d) => d.id !== id)
                    .map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department Head</InputLabel>
                <Select
                  value={formData.manager_id}
                  label="Department Head"
                  onChange={(e) => handleChange('manager_id', e.target.value)}
                >
                  <MenuItem value="">Not Assigned</MenuItem>
                  {managers.map((mgr) => (
                    <MenuItem key={mgr.id} value={mgr.id}>
                      {mgr.full_name} - {mgr.job_title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Budget"
                type="number"
                value={formData.budget || ''}
                onChange={(e) => handleChange('budget', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Annual budget"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: '#64748B' }}>$</Typography>,
                }}
              />
            </Grid>
            {mode === 'edit' && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                    />
                  }
                  label="Active Department"
                />
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <Button
              onClick={() => navigate('/departments')}
              sx={{ mr: 2, color: '#64748B', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving || !formData.name || !formData.code}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
              sx={{
                bgcolor: '#0F172A',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': { bgcolor: '#1a2236' },
                '&:disabled': { bgcolor: '#94A3B8' },
              }}
            >
              {saving ? 'Saving...' : mode === 'create' ? 'Create Department' : 'Save Changes'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
