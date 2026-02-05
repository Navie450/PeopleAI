import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  alpha,
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PushPin as PinIcon,
  PushPinOutlined as UnpinIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { announcementsApi } from '@/api/announcements.api'
import type { AnnouncementListItem, AnnouncementType, AnnouncementPriority } from '@/types'
import {
  announcementTypeLabels,
  announcementTypeColors,
  announcementPriorityLabels,
  announcementPriorityColors,
} from '@/types'

export const AnnouncementManagement = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AnnouncementType | ''>('')
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | ''>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const limit = 10

  useEffect(() => {
    fetchAnnouncements()
  }, [search, typeFilter, isActiveFilter, page])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await announcementsApi.listAll({
        search: search || undefined,
        type: typeFilter || undefined,
        is_active: isActiveFilter === '' ? undefined : isActiveFilter,
        include_expired: true,
        page,
        limit,
      })
      setAnnouncements(response.data.data)
      setTotalPages(response.data.meta?.pagination?.totalPages || 1)
    } catch (error) {
      enqueueSnackbar('Failed to load announcements', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedId(id)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedId(null)
  }

  const handleEdit = () => {
    if (selectedId) {
      navigate(`/announcements/${selectedId}/edit`)
    }
    handleMenuClose()
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
    setAnchorEl(null)
  }

  const confirmDelete = async () => {
    if (!selectedId) return

    try {
      setDeleting(true)
      await announcementsApi.delete(selectedId)
      enqueueSnackbar('Announcement deleted', { variant: 'success' })
      setDeleteDialogOpen(false)
      setSelectedId(null)
      fetchAnnouncements()
    } catch (error) {
      enqueueSnackbar('Failed to delete announcement', { variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      await announcementsApi.togglePin(id, { is_pinned: !currentPinned })
      enqueueSnackbar(`Announcement ${currentPinned ? 'unpinned' : 'pinned'}`, { variant: 'success' })
      fetchAnnouncements()
    } catch (error) {
      enqueueSnackbar('Failed to update announcement', { variant: 'error' })
    }
    handleMenuClose()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const selectedAnnouncement = announcements.find((a) => a.id === selectedId)

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Announcement Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/announcements/new')}
          sx={{
            backgroundColor: '#0F172A',
            '&:hover': { backgroundColor: '#1E293B' },
          }}
        >
          New Announcement
        </Button>
      </Box>

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              sx={{ flex: 1, minWidth: 250 }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => {
                  setTypeFilter(e.target.value as AnnouncementType | '')
                  setPage(1)
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                {Object.entries(announcementTypeLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={isActiveFilter}
                label="Status"
                onChange={(e) => {
                  setIsActiveFilter(e.target.value as boolean | '')
                  setPage(1)
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={true as any}>Active</MenuItem>
                <MenuItem value={false as any}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card
        sx={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 3,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton variant="text" width={200} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={60} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={60} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="circular" width={32} height={32} />
                    </TableCell>
                  </TableRow>
                ))
              ) : announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <TableRow key={announcement.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {announcement.is_pinned && (
                          <PinIcon sx={{ fontSize: 16, color: '#F59E0B', transform: 'rotate(45deg)' }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {announcement.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={announcementTypeLabels[announcement.type]}
                        size="small"
                        sx={{
                          backgroundColor: alpha(announcementTypeColors[announcement.type], 0.1),
                          color: announcementTypeColors[announcement.type],
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={announcementPriorityLabels[announcement.priority]}
                        color={announcementPriorityColors[announcement.priority]}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={announcement.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          backgroundColor: announcement.is_active
                            ? alpha('#10B981', 0.1)
                            : alpha('#64748B', 0.1),
                          color: announcement.is_active ? '#10B981' : '#64748B',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>
                        {formatDate(announcement.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, announcement.id)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                    <Typography variant="body1" sx={{ color: '#64748B' }}>
                      No announcements found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
            />
          </Box>
        )}
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {selectedAnnouncement && (
          <MenuItem onClick={() => handleTogglePin(selectedId!, selectedAnnouncement.is_pinned)}>
            <ListItemIcon>
              {selectedAnnouncement.is_pinned ? (
                <UnpinIcon fontSize="small" />
              ) : (
                <PinIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>{selectedAnnouncement.is_pinned ? 'Unpin' : 'Pin'}</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this announcement? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
