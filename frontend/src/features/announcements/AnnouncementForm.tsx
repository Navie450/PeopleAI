import { useEffect, useState } from 'react'
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
  FormControlLabel,
  Switch,
  Chip,
  Autocomplete,
  Alert,
  Skeleton,
} from '@mui/material'
import { ArrowBack as BackIcon, Save as SaveIcon } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { announcementsApi } from '@/api/announcements.api'
import { departmentsApi } from '@/api/departments.api'
import type {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementType,
  AnnouncementPriority,
  Department,
} from '@/types'
import { announcementTypeLabels, announcementPriorityLabels } from '@/types'

interface AnnouncementFormProps {
  mode: 'create' | 'edit'
}

const announcementTypes: AnnouncementType[] = [
  'general',
  'hr_update',
  'policy',
  'event',
  'celebration',
  'urgent',
]

const announcementPriorities: AnnouncementPriority[] = ['low', 'normal', 'high', 'critical']

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ mode }) => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<CreateAnnouncementDto>({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    is_active: true,
    is_pinned: false,
    target_departments: [],
    publish_date: undefined,
    expiry_date: undefined,
  })

  useEffect(() => {
    fetchDepartments()
    if (mode === 'edit' && id) {
      fetchAnnouncement()
    }
  }, [mode, id])

  const fetchDepartments = async () => {
    try {
      const response = await departmentsApi.list()
      setDepartments(response.data.data)
    } catch (error) {
      // Silently fail - department selection will just be empty
    }
  }

  const fetchAnnouncement = async () => {
    if (!id) return
    try {
      setLoading(true)
      const response = await announcementsApi.getById(id)
      const data = response.data.data
      setFormData({
        title: data.title,
        content: data.content,
        type: data.type,
        priority: data.priority,
        is_active: data.is_active,
        is_pinned: data.is_pinned,
        target_departments: data.target_departments || [],
        publish_date: data.publish_date
          ? new Date(data.publish_date).toISOString().slice(0, 16)
          : undefined,
        expiry_date: data.expiry_date
          ? new Date(data.expiry_date).toISOString().slice(0, 16)
          : undefined,
      })
    } catch (error) {
      enqueueSnackbar('Failed to load announcement', { variant: 'error' })
      navigate('/announcements/manage')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    if (!formData.content.trim()) {
      setError('Content is required')
      return
    }

    try {
      setSaving(true)

      const payload: CreateAnnouncementDto | UpdateAnnouncementDto = {
        ...formData,
        publish_date: formData.publish_date || undefined,
        expiry_date: formData.expiry_date || undefined,
        target_departments:
          formData.target_departments && formData.target_departments.length > 0
            ? formData.target_departments
            : undefined,
      }

      if (mode === 'create') {
        await announcementsApi.create(payload as CreateAnnouncementDto)
        enqueueSnackbar('Announcement created successfully', { variant: 'success' })
      } else if (id) {
        await announcementsApi.update(id, payload as UpdateAnnouncementDto)
        enqueueSnackbar('Announcement updated successfully', { variant: 'success' })
      }

      navigate('/announcements/manage')
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to save announcement',
        { variant: 'error' }
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
        <Skeleton variant="rounded" height={600} sx={{ borderRadius: 3 }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate('/announcements/manage')}
        sx={{ mb: 3 }}
      >
        Back to Announcements
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        {mode === 'create' ? 'New Announcement' : 'Edit Announcement'}
      </Typography>

      <Card
        sx={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Title"
                required
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                inputProps={{ maxLength: 200 }}
                helperText={`${formData.title.length}/200 characters`}
              />

              <TextField
                label="Content"
                required
                fullWidth
                multiline
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your announcement content here..."
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Type"
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as AnnouncementType })
                    }
                  >
                    {announcementTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {announcementTypeLabels[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as AnnouncementPriority })
                    }
                  >
                    {announcementPriorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {announcementPriorityLabels[priority]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Publish Date (Optional)"
                  type="datetime-local"
                  fullWidth
                  value={formData.publish_date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, publish_date: e.target.value || undefined })
                  }
                  InputLabelProps={{ shrink: true }}
                  helperText="Leave empty to publish immediately"
                />

                <TextField
                  label="Expiry Date (Optional)"
                  type="datetime-local"
                  fullWidth
                  value={formData.expiry_date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value || undefined })
                  }
                  InputLabelProps={{ shrink: true }}
                  helperText="Leave empty for no expiration"
                />
              </Box>

              <Autocomplete
                multiple
                options={departments}
                getOptionLabel={(option) => option.name}
                value={departments.filter((d) =>
                  formData.target_departments?.includes(d.id)
                )}
                onChange={(_, newValue) =>
                  setFormData({
                    ...formData,
                    target_departments: newValue.map((d) => d.id),
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Target Departments (Optional)"
                    placeholder="Select departments..."
                    helperText="Leave empty to show to all departments"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
              />

              <Box sx={{ display: 'flex', gap: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_pinned}
                      onChange={(e) =>
                        setFormData({ ...formData, is_pinned: e.target.checked })
                      }
                    />
                  }
                  label="Pinned"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  onClick={() => navigate('/announcements/manage')}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={<SaveIcon />}
                  sx={{
                    backgroundColor: '#0F172A',
                    '&:hover': { backgroundColor: '#1E293B' },
                  }}
                >
                  {saving
                    ? 'Saving...'
                    : mode === 'create'
                    ? 'Create Announcement'
                    : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
