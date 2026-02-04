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
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { usersApi } from '@/api/users.api'
import type { User, CreateUserDto, UpdateUserDto } from '@/types'

interface UserFormProps {
  mode: 'create' | 'edit'
}

export const UserForm: React.FC<UserFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    is_active: true,
  })

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const { data } = await usersApi.getById(id)
          const user = data.data as User
          if (user) {
            setFormData({
              email: user.email || '',
              password: '',
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              phone: user.phone || '',
              is_active: user.is_active,
            })
          }
        } catch (err) {
          console.error('Failed to fetch user:', err)
          setError('Failed to load user data')
        } finally {
          setLoading(false)
        }
      }
      fetchUser()
    }
  }, [mode, id])

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setSaving(true)
      setError(null)

      if (!formData.email.trim()) {
        setError('Email is required')
        setSaving(false)
        return
      }

      if (mode === 'create' && !formData.password) {
        setError('Password is required')
        setSaving(false)
        return
      }

      if (mode === 'create') {
        const createData: CreateUserDto = {
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name || undefined,
          last_name: formData.last_name || undefined,
          phone: formData.phone || undefined,
        }
        await usersApi.create(createData)
      } else if (id) {
        const updateData: UpdateUserDto = {
          email: formData.email,
          first_name: formData.first_name || undefined,
          last_name: formData.last_name || undefined,
          phone: formData.phone || undefined,
          is_active: formData.is_active,
        }
        await usersApi.update(id, updateData)
      }

      navigate('/users')
    } catch (err: any) {
      console.error('Failed to save user:', err)
      setError(err.response?.data?.message || 'Failed to save user')
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
          onClick={() => navigate('/users')}
          sx={{ mb: 2, color: '#64748B', fontWeight: 600 }}
        >
          Back to Users
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
          {mode === 'create' ? 'Add New User' : 'Edit User'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
          {mode === 'create' ? 'Create a new user account' : 'Update user information'}
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
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
              />
            </Grid>

            {/* Account Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                Account Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={!!error && !formData.email.trim()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Grid>
            {mode === 'create' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  error={!!error && !formData.password}
                />
              </Grid>
            )}

            {/* Status Toggle - only in edit mode */}
            {mode === 'edit' && (
              <>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Status
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={(e) => handleChange('is_active', e.target.checked)}
                      />
                    }
                    label={formData.is_active ? 'Active' : 'Inactive'}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <Button
              onClick={() => navigate('/users')}
              sx={{ mr: 2, color: '#64748B' }}
            >
              Cancel
            </Button>
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
              {saving ? 'Saving...' : mode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
