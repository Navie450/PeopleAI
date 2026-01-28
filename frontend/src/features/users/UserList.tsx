import { useEffect, useState } from 'react'
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
} from '@mui/material'
import {
  Search,
  PersonAdd,
  GridView,
  TableRows,
  MoreVert,
  Edit,
  Delete,
  PersonOff,
  CheckCircle,
} from '@mui/icons-material'
import { usersApi } from '@/api/users.api'
import { useNavigate } from 'react-router-dom'
import type { User } from '@/types'

export const UserList = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [page, setPage] = useState(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await usersApi.list({ page, limit: 12 })
      setUsers(data.data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleEdit = () => {
    if (selectedUser) {
      navigate(`/users/${selectedUser.id}/edit`)
    }
    handleMenuClose()
  }

  const handleDeactivate = async () => {
    if (selectedUser) {
      try {
        if (selectedUser.is_active) {
          await usersApi.deactivate(selectedUser.id)
        } else {
          await usersApi.activate(selectedUser.id)
        }
        fetchUsers()
      } catch (error) {
        console.error('Failed to update user status:', error)
      }
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (selectedUser && window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersApi.delete(selectedUser.id)
        fetchUsers()
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
    handleMenuClose()
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active)

    const matchesRole =
      roleFilter === 'all' ||
      user.user_roles?.some((ur) => ur.role.role_name === roleFilter)

    return matchesSearch && matchesStatus && matchesRole
  })

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
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
            }}
          >
            Users
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.5)', fontWeight: 500 }}>
            Manage user accounts and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => navigate('/users/new')}
          sx={{
            bgcolor: '#0F172A',
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
            '&:hover': { bgcolor: '#1a2236', transform: 'translateY(-1px)' },
            transition: 'all 0.2s'
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, bgcolor: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.06)', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', borderRadius: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F1F5F9',
                    borderRadius: 50,
                    color: '#0F172A',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#0F172A' },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'rgba(0, 0, 0, 0.4)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F1F5F9',
                  borderRadius: 50,
                  color: '#0F172A',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.4)' }
              }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    '& .MuiSelect-icon': { color: 'rgba(0, 0, 0, 0.4)' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { bgcolor: '#FFFFFF', color: '#0F172A', border: '1px solid rgba(0, 0, 0, 0.08)' }
                    }
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#F1F5F9',
                  borderRadius: 50,
                  color: '#0F172A',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#CBD5E1' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.4)' }
              }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                  sx={{
                    '& .MuiSelect-icon': { color: 'rgba(0, 0, 0, 0.4)' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { bgcolor: '#FFFFFF', color: '#0F172A', border: '1px solid rgba(0, 0, 0, 0.08)' }
                    }
                  }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
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
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: '#FFFFFF' }
                    }
                  }
                }}
              >
                <ToggleButton value="grid">
                  <GridView fontSize="small" />
                </ToggleButton>
                <ToggleButton value="table">
                  <TableRows fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* User Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
        </Typography>
      </Box>

      {/* Main Content */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Loading users...
          </Typography>
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(15, 23, 42, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <PersonAdd sx={{ fontSize: 32, color: '#0F172A' }} />
            </Box>
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>
              No users found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first user
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/users/new')}
              sx={{ textTransform: 'none' }}
            >
              Add Your First User
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredUsers.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user.id}>
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
                        transform: 'translateY(-8px)',
                        borderColor: '#0F172A',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 100%)',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.3)',
                      },
                    }}
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(15, 23, 42, 0.15)',
                            color: '#0F172A',
                            width: 48,
                            height: 48,
                            fontSize: '1.25rem',
                            fontWeight: 700,
                          }}
                        >
                          {user.first_name?.[0] || user.email[0].toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="h3"
                                noWrap
                                sx={{ mb: 0.5, fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}
                              >
                                {user.first_name && user.last_name
                                  ? `${user.first_name} ${user.last_name}`
                                  : 'No name'}
                              </Typography>
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.5)' }}
                              >
                                {user.email}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, user)}
                              sx={{
                                ml: 1,
                                color: 'rgba(0, 0, 0, 0.4)',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                                  color: '#0F172A',
                                },
                              }}
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                          label={user.is_active ? 'ACTIVE' : 'INACTIVE'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            height: 20,
                            borderRadius: '4px',
                            bgcolor: user.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: user.is_active ? '#10B981' : '#EF4444',
                          }}
                        />
                      </Stack>

                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontSize: '0.6rem',
                            mb: 1,
                            display: 'block',
                            color: 'rgba(0, 0, 0, 0.4)',
                          }}
                        >
                          ROLES
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {user.user_roles?.slice(0, 3).map((ur) => (
                            <Chip
                              key={ur.role.id}
                              label={ur.role.role_name}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                height: 20,
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                                color: 'rgba(0, 0, 0, 0.6)',
                                bgcolor: 'rgba(0, 0, 0, 0.02)',
                              }}
                            />
                          ))}
                          {(user.user_roles?.length || 0) > 3 && (
                            <Chip
                              label={`+${(user.user_roles?.length || 0) - 3}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                height: 20,
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                                color: 'rgba(0, 0, 0, 0.4)',
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
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
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} hover onClick={() => navigate(`/users/${u.id}`)} sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ py: 2, borderBottom: '1px solid #F1F5F9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'rgba(15, 23, 42, 0.1)',
                              color: '#0F172A',
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
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                          {u.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip
                          label={u.is_active ? 'ACTIVE' : 'INACTIVE'}
                          size="small"
                          sx={{
                            height: 20,
                            backgroundColor: u.is_active ? '#F0FDF4' : '#FEF2F2',
                            color: u.is_active ? '#16A34A' : '#EF4444',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            borderRadius: '4px',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Stack direction="row" spacing={0.5}>
                          {u.user_roles?.map(ur => (
                            <Chip
                              key={ur.role.id}
                              label={ur.role.role_name.toUpperCase()}
                              size="small"
                              sx={{ height: 20, bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.65rem' }}
                            />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, u)} sx={{ color: '#94A3B8' }}>
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
              count={10}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'rgba(0, 0, 0, 0.6)',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(15, 23, 42, 0.1)',
                    color: '#0F172A',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                  }
                }
              }}
            />
          </Box>
        </>
      )
      }

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeactivate}>
          <ListItemIcon>
            {selectedUser?.is_active ? (
              <PersonOff fontSize="small" />
            ) : (
              <CheckCircle fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.is_active ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box >
  )
}
