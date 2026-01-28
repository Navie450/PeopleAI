import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  Tabs,
  Tab,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  PersonOff,
  CheckCircle,
  Delete,
  Add,
  Close,
  Email,
  CalendarToday,
  Security,
} from '@mui/icons-material'
import { usersApi } from '@/api/users.api'
import { useNavigate, useParams } from 'react-router-dom'
import type { User, Role } from '@/types'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export const UserDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')

  const availableRoles = ['admin', 'manager', 'user']

  const fetchUser = async () => {
    if (!id) return
    try {
      setLoading(true)
      const { data } = await usersApi.getById(id)
      setUser(data.data || null)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [id])

  const handleStatusToggle = async () => {
    if (!user) return
    try {
      if (user.is_active) {
        await usersApi.deactivate(user.id)
      } else {
        await usersApi.activate(user.id)
      }
      fetchUser()
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const handleDelete = async () => {
    if (!user || !window.confirm('Are you sure you want to delete this user?')) return
    try {
      await usersApi.delete(user.id)
      navigate('/users')
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleAddRole = async () => {
    if (!user || !selectedRole) return
    try {
      await usersApi.assignRole(user.id, selectedRole)
      setRoleDialogOpen(false)
      setSelectedRole('')
      fetchUser()
    } catch (error) {
      console.error('Failed to add role:', error)
    }
  }

  const handleRemoveRole = async (roleId: string) => {
    if (!user || !window.confirm('Are you sure you want to remove this role?')) return
    try {
      await usersApi.removeRole(user.id, roleId)
      fetchUser()
    } catch (error) {
      console.error('Failed to remove role:', error)
    }
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          Loading user details...
        </Typography>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          User not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/users')}>
          Back to Users
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/users')}
          sx={{ mb: 3 }}
        >
          Back to Users
        </Button>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  width: 96,
                  height: 96,
                  fontSize: '2.5rem',
                }}
              >
                {user.first_name?.[0] || user.email[0].toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h1">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : 'No name'}
                  </Typography>
                  <Chip
                    label={user.is_active ? 'Active' : 'Inactive'}
                    color={user.is_active ? 'success' : 'error'}
                  />
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {user.email}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                  {user.user_roles?.map((ur) => (
                    <Chip
                      key={ur.role.id}
                      label={ur.role.role_name}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/users/${user.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color={user.is_active ? 'warning' : 'success'}
                  startIcon={user.is_active ? <PersonOff /> : <CheckCircle />}
                  onClick={handleStatusToggle}
                >
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
            <Tab label="Overview" />
            <Tab label="Roles" />
            <Tab label="Activity" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h2" sx={{ mb: 3 }}>
                    Personal Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography variant="body1">
                        {user.first_name || 'Not provided'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography variant="body1">
                        {user.last_name || 'Not provided'}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email Address
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body1">{user.email}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Account Information */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h2" sx={{ mb: 3 }}>
                    Account Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        User ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                        {user.id}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={user.is_active ? 'Active' : 'Inactive'}
                          size="small"
                          color={user.is_active ? 'success' : 'error'}
                        />
                      </Box>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created At
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Roles Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h2">Assigned Roles</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setRoleDialogOpen(true)}
            >
              Add Role
            </Button>
          </Box>

          {user.user_roles && user.user_roles.length > 0 ? (
            <Card variant="outlined">
              <List>
                {user.user_roles.map((ur, index) => (
                  <Box key={ur.role.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Security sx={{ color: 'primary.main' }} />
                            <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                              {ur.role.role_name}
                            </Typography>
                          </Box>
                        }
                        secondary={`Assigned on ${
                          ur.assigned_at
                            ? new Date(ur.assigned_at).toLocaleDateString()
                            : 'Unknown'
                        }`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleRemoveRole(ur.role.id)}
                        >
                          <Close />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < user.user_roles!.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Card>
          ) : (
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="body1" color="text.secondary">
                  No roles assigned to this user
                </Typography>
              </CardContent>
            </Card>
          )}
        </TabPanel>

        {/* Activity Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Recent Activity
          </Typography>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" color="text.secondary">
                Activity tracking coming soon
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              label="Select Role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {availableRoles
                .filter((role) => !user.user_roles?.some((ur) => ur.role.role_name === role))
                .map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddRole} disabled={!selectedRole}>
            Add Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
