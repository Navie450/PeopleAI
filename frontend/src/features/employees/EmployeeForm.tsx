import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
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
  Divider,
  Stack,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  IconButton,
  Avatar,
  CircularProgress,
} from '@mui/material'
import {
  ArrowBack,
  Save,
  Person,
  Work,
  ContactPhone,
  School,
  Add,
  Delete,
} from '@mui/icons-material'
import { employeesApi } from '@/api/employees.api'
import { departmentsApi } from '@/api/departments.api'
import { usersApi } from '@/api/users.api'
import type { CreateEmployeeDto, UpdateEmployeeDto, Employee, DepartmentListItem, EmployeeListItem, User, Skill, EmergencyContact } from '@/types'

interface EmployeeFormProps {
  mode: 'create' | 'edit'
}

const steps = ['Personal Info', 'Employment', 'Contact & Location', 'Skills & Emergency']

export const EmployeeForm = ({ mode }: EmployeeFormProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [departments, setDepartments] = useState<DepartmentListItem[]>([])
  const [managers, setManagers] = useState<EmployeeListItem[]>([])
  const [users, setUsers] = useState<User[]>([])

  // Form state
  const [formData, setFormData] = useState<CreateEmployeeDto & { id?: string }>({
    user_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    nationality: '',
    marital_status: '',
    work_email: '',
    personal_email: '',
    work_phone: '',
    personal_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    department_id: '',
    job_title: '',
    job_level: '',
    employment_type: 'full_time',
    employment_status: 'active',
    hire_date: new Date().toISOString().split('T')[0],
    probation_end_date: '',
    manager_id: '',
    base_salary: undefined,
    salary_currency: 'USD',
    salary_frequency: 'annual',
    work_location: '',
    work_schedule: '',
    timezone: '',
    is_remote: false,
    skills: [],
    emergency_contacts: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptRes = await departmentsApi.list({ limit: 100 })
        setDepartments(deptRes.data.data || [])

        // Fetch potential managers
        const empRes = await employeesApi.list({ limit: 100, employment_status: 'active' })
        setManagers(empRes.data.data || [])

        // Fetch users for linking (only for create mode)
        if (mode === 'create') {
          const usersRes = await usersApi.list({ limit: 100 })
          setUsers(usersRes.data.data || [])
        }

        // Fetch employee data for edit mode
        if (mode === 'edit' && id) {
          const empDetailRes = await employeesApi.getById(id)
          const emp = empDetailRes.data.data
          if (emp) {
            setFormData({
              user_id: emp.id, // Not editable
              first_name: emp.first_name,
              middle_name: emp.middle_name || '',
              last_name: emp.last_name,
              date_of_birth: emp.date_of_birth || '',
              gender: emp.gender || '',
              nationality: emp.nationality || '',
              marital_status: emp.marital_status || '',
              work_email: emp.work_email,
              personal_email: emp.personal_email || '',
              work_phone: emp.work_phone || '',
              personal_phone: emp.personal_phone || '',
              address_line1: emp.address?.line1 || '',
              address_line2: emp.address?.line2 || '',
              city: emp.address?.city || '',
              state: emp.address?.state || '',
              postal_code: emp.address?.postal_code || '',
              country: emp.address?.country || '',
              department_id: emp.department?.id || '',
              job_title: emp.job_title,
              job_level: emp.job_level || '',
              employment_type: emp.employment_type,
              employment_status: emp.employment_status,
              hire_date: emp.hire_date,
              probation_end_date: emp.probation_end_date || '',
              manager_id: emp.manager?.id || '',
              base_salary: emp.base_salary,
              salary_currency: emp.salary_currency,
              salary_frequency: emp.salary_frequency,
              work_location: emp.work_location || '',
              work_schedule: emp.work_schedule || '',
              timezone: emp.timezone || '',
              is_remote: emp.is_remote,
              skills: emp.skills || [],
              emergency_contacts: emp.emergency_contacts || [],
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

  const handleAddSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { name: '', level: 'beginner' as const }],
    }))
  }

  const handleUpdateSkill = (index: number, field: keyof Skill, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index),
    }))
  }

  const handleAddEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergency_contacts: [
        ...(prev.emergency_contacts || []),
        { name: '', relationship: '', phone: '', is_primary: prev.emergency_contacts?.length === 0 },
      ],
    }))
  }

  const handleUpdateEmergencyContact = (index: number, field: keyof EmergencyContact, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts?.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }))
  }

  const handleRemoveEmergencyContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts?.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      setError(null)

      // Validate required fields
      if (mode === 'create' && !formData.user_id) {
        setError('Please select a user account to link')
        setActiveStep(0)
        setSaving(false)
        return
      }
      if (!formData.first_name.trim()) {
        setError('First name is required')
        setActiveStep(0)
        setSaving(false)
        return
      }
      if (!formData.last_name.trim()) {
        setError('Last name is required')
        setActiveStep(0)
        setSaving(false)
        return
      }
      if (!formData.work_email.trim()) {
        setError('Work email is required')
        setActiveStep(1)
        setSaving(false)
        return
      }
      if (!formData.job_title.trim()) {
        setError('Job title is required')
        setActiveStep(1)
        setSaving(false)
        return
      }
      if (!formData.hire_date) {
        setError('Hire date is required')
        setActiveStep(1)
        setSaving(false)
        return
      }

      // Clean up form data: strip empty strings from optional fields
      const requiredKeys = ['user_id', 'first_name', 'last_name', 'work_email', 'job_title', 'hire_date', 'employment_type', 'employment_status', 'salary_currency', 'salary_frequency', 'is_remote']
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          if (requiredKeys.includes(key)) return true
          if (key === 'id') return false
          if (value === '' || value === undefined || value === null) return false
          if (Array.isArray(value) && value.length === 0) return false
          return true
        })
      ) as CreateEmployeeDto

      if (mode === 'create') {
        await employeesApi.create(cleanData)
      } else if (id) {
        const updateData: UpdateEmployeeDto = { ...cleanData }
        delete (updateData as any).user_id
        await employeesApi.update(id, updateData)
      }

      navigate('/employees')
    } catch (err: any) {
      console.error('Failed to save employee:', err)
      setError(err.response?.data?.message || 'Failed to save employee')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = () => setActiveStep((prev) => prev + 1)
  const handleBack = () => setActiveStep((prev) => prev - 1)

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
          onClick={() => navigate('/employees')}
          sx={{ mb: 2, color: '#64748B', fontWeight: 600 }}
        >
          Back to Employees
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
          {mode === 'create' ? 'Add New Employee' : 'Edit Employee'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
          {mode === 'create' ? 'Fill in the employee details below' : 'Update employee information'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper
        activeStep={activeStep}
        sx={{
          mb: 4,
          '& .MuiStepLabel-label': { fontWeight: 600 },
          '& .MuiStepIcon-root.Mui-active': { color: '#0F172A' },
          '& .MuiStepIcon-root.Mui-completed': { color: '#10B981' },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          animation: 'fadeIn 0.5s ease-out 0.1s both',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Step 0: Personal Info */}
          {activeStep === 0 && (
            <Grid container spacing={3}>
              {mode === 'create' && (
                <Grid item xs={12}>
                  <FormControl fullWidth required error={!!error && !formData.user_id}>
                    <InputLabel>Link to User Account</InputLabel>
                    <Select
                      value={formData.user_id}
                      label="Link to User Account"
                      onChange={(e) => handleChange('user_id', e.target.value)}
                    >
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.first_name} {user.last_name} ({user.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  error={!!error && !formData.first_name.trim()}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={formData.middle_name}
                  onChange={(e) => handleChange('middle_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  error={!!error && !formData.last_name.trim()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Gender"
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={formData.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    value={formData.marital_status}
                    label="Marital Status"
                    onChange={(e) => handleChange('marital_status', e.target.value)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Divorced">Divorced</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Step 1: Employment */}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Work Email"
                  type="email"
                  value={formData.work_email}
                  onChange={(e) => handleChange('work_email', e.target.value)}
                  error={!!error && !formData.work_email.trim()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Job Title"
                  value={formData.job_title}
                  onChange={(e) => handleChange('job_title', e.target.value)}
                  error={!!error && !formData.job_title.trim()}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Job Level</InputLabel>
                  <Select
                    value={formData.job_level}
                    label="Job Level"
                    onChange={(e) => handleChange('job_level', e.target.value)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Entry">Entry</MenuItem>
                    <MenuItem value="Junior">Junior</MenuItem>
                    <MenuItem value="Mid">Mid</MenuItem>
                    <MenuItem value="Senior">Senior</MenuItem>
                    <MenuItem value="Lead">Lead</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Director">Director</MenuItem>
                    <MenuItem value="VP">VP</MenuItem>
                    <MenuItem value="C-Level">C-Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department_id}
                    label="Department"
                    onChange={(e) => handleChange('department_id', e.target.value)}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Reports To</InputLabel>
                  <Select
                    value={formData.manager_id}
                    label="Reports To"
                    onChange={(e) => handleChange('manager_id', e.target.value)}
                  >
                    <MenuItem value="">None</MenuItem>
                    {managers.filter(m => m.id !== id).map((mgr) => (
                      <MenuItem key={mgr.id} value={mgr.id}>{mgr.full_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    value={formData.employment_type}
                    label="Employment Type"
                    onChange={(e) => handleChange('employment_type', e.target.value)}
                  >
                    <MenuItem value="full_time">Full Time</MenuItem>
                    <MenuItem value="part_time">Part Time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="intern">Intern</MenuItem>
                    <MenuItem value="freelance">Freelance</MenuItem>
                    <MenuItem value="temporary">Temporary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    value={formData.employment_status}
                    label="Employment Status"
                    onChange={(e) => handleChange('employment_status', e.target.value)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="probation">Probation</MenuItem>
                    <MenuItem value="on_leave">On Leave</MenuItem>
                    <MenuItem value="notice_period">Notice Period</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Hire Date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => handleChange('hire_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!error && !formData.hire_date}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Probation End Date"
                  type="date"
                  value={formData.probation_end_date}
                  onChange={(e) => handleChange('probation_end_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#64748B' }}>
                  Compensation
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Base Salary"
                  type="number"
                  value={formData.base_salary || ''}
                  onChange={(e) => handleChange('base_salary', e.target.value ? Number(e.target.value) : undefined)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={formData.salary_currency}
                    label="Currency"
                    onChange={(e) => handleChange('salary_currency', e.target.value)}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                    <MenuItem value="INR">INR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.salary_frequency}
                    label="Frequency"
                    onChange={(e) => handleChange('salary_frequency', e.target.value)}
                  >
                    <MenuItem value="annual">Annual</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="hourly">Hourly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Step 2: Contact & Location */}
          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Work Phone"
                  value={formData.work_phone}
                  onChange={(e) => handleChange('work_phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Personal Phone"
                  value={formData.personal_phone}
                  onChange={(e) => handleChange('personal_phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Personal Email"
                  type="email"
                  value={formData.personal_email}
                  onChange={(e) => handleChange('personal_email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#64748B' }}>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  value={formData.address_line1}
                  onChange={(e) => handleChange('address_line1', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={formData.address_line2}
                  onChange={(e) => handleChange('address_line2', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={formData.postal_code}
                  onChange={(e) => handleChange('postal_code', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#64748B' }}>
                  Work Location
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Work Location"
                  value={formData.work_location}
                  onChange={(e) => handleChange('work_location', e.target.value)}
                  placeholder="e.g., New York Office"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Timezone"
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  placeholder="e.g., America/New_York"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_remote}
                      onChange={(e) => handleChange('is_remote', e.target.checked)}
                    />
                  }
                  label="Remote Employee"
                />
              </Grid>
            </Grid>
          )}

          {/* Step 3: Skills & Emergency */}
          {activeStep === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Skills</Typography>
                  <Button startIcon={<Add />} onClick={handleAddSkill} size="small">
                    Add Skill
                  </Button>
                </Box>
                {formData.skills?.map((skill, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <TextField
                      label="Skill Name"
                      value={skill.name}
                      onChange={(e) => handleUpdateSkill(index, 'name', e.target.value)}
                      sx={{ flex: 2 }}
                    />
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={skill.level}
                        label="Level"
                        onChange={(e) => handleUpdateSkill(index, 'level', e.target.value)}
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                        <MenuItem value="expert">Expert</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton onClick={() => handleRemoveSkill(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Emergency Contacts</Typography>
                  <Button startIcon={<Add />} onClick={handleAddEmergencyContact} size="small">
                    Add Contact
                  </Button>
                </Box>
                {formData.emergency_contacts?.map((contact, index) => (
                  <Card key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={contact.name}
                          onChange={(e) => handleUpdateEmergencyContact(index, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Relationship"
                          value={contact.relationship}
                          onChange={(e) => handleUpdateEmergencyContact(index, 'relationship', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={contact.phone}
                          onChange={(e) => handleUpdateEmergencyContact(index, 'phone', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={contact.is_primary}
                              onChange={(e) => handleUpdateEmergencyContact(index, 'is_primary', e.target.checked)}
                            />
                          }
                          label="Primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => handleRemoveEmergencyContact(index)} color="error">
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ color: '#64748B' }}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{
                    bgcolor: '#0F172A',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#1a2236' },
                  }}
                >
                  {saving ? 'Saving...' : mode === 'create' ? 'Create Employee' : 'Save Changes'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    bgcolor: '#0F172A',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#1a2236' },
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
