import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  alpha,
} from '@mui/material'
import { Search as SearchIcon, Close as CloseIcon, PushPin as PinIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { announcementsApi } from '@/api/announcements.api'
import type { AnnouncementListItem, Announcement, AnnouncementType } from '@/types'
import { announcementTypeLabels, announcementTypeColors, announcementPriorityColors } from '@/types'
import { AnnouncementCard } from './components'

const announcementTypes: AnnouncementType[] = [
  'general',
  'hr_update',
  'policy',
  'event',
  'celebration',
  'urgent',
]

export const Announcements = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<AnnouncementListItem[]>([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AnnouncementType | ''>('')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchAnnouncements()
  }, [search, typeFilter])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await announcementsApi.list({
        search: search || undefined,
        type: typeFilter || undefined,
        limit: 50,
      })
      setAnnouncements(response.data.data)
    } catch (error) {
      enqueueSnackbar('Failed to load announcements', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleAnnouncementClick = async (id: string) => {
    try {
      setDetailLoading(true)
      const response = await announcementsApi.getById(id)
      setSelectedAnnouncement(response.data.data)
    } catch (error) {
      enqueueSnackbar('Failed to load announcement details', { variant: 'error' })
    } finally {
      setDetailLoading(false)
    }
  }

  const pinnedAnnouncements = announcements.filter((a) => a.is_pinned)
  const regularAnnouncements = announcements.filter((a) => !a.is_pinned)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        Announcements
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748B' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value as AnnouncementType | '')}
          >
            <MenuItem value="">All Types</MenuItem>
            {announcementTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {announcementTypeLabels[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : announcements.length > 0 ? (
        <>
          {/* Pinned Announcements */}
          {pinnedAnnouncements.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PinIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  Pinned
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {pinnedAnnouncements.map((announcement, index) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    key={announcement.id}
                    sx={{
                      animation: 'fadeIn 0.5s ease-out',
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'both',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    <AnnouncementCard
                      announcement={announcement}
                      onClick={handleAnnouncementClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Regular Announcements */}
          {regularAnnouncements.length > 0 && (
            <Box>
              {pinnedAnnouncements.length > 0 && (
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2 }}>
                  Recent
                </Typography>
              )}
              <Grid container spacing={3}>
                {regularAnnouncements.map((announcement, index) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    key={announcement.id}
                    sx={{
                      animation: 'fadeIn 0.5s ease-out',
                      animationDelay: `${(pinnedAnnouncements.length + index) * 0.05}s`,
                      animationFillMode: 'both',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    <AnnouncementCard
                      announcement={announcement}
                      onClick={handleAnnouncementClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
            No announcements found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            {search || typeFilter
              ? 'Try adjusting your search or filters'
              : 'No announcements have been posted yet'}
          </Typography>
        </Box>
      )}

      {/* Announcement Detail Dialog */}
      <Dialog
        open={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedAnnouncement && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                pb: 1,
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip
                    label={announcementTypeLabels[selectedAnnouncement.type]}
                    size="small"
                    sx={{
                      backgroundColor: alpha(announcementTypeColors[selectedAnnouncement.type], 0.1),
                      color: announcementTypeColors[selectedAnnouncement.type],
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={selectedAnnouncement.priority}
                    color={announcementPriorityColors[selectedAnnouncement.priority]}
                    size="small"
                    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                  />
                  {selectedAnnouncement.is_pinned && (
                    <Chip
                      icon={<PinIcon sx={{ fontSize: 14 }} />}
                      label="Pinned"
                      size="small"
                      sx={{
                        backgroundColor: alpha('#F59E0B', 0.1),
                        color: '#F59E0B',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {selectedAnnouncement.title}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedAnnouncement(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Posted on {formatDate(selectedAnnouncement.created_at)}
                  {selectedAnnouncement.author && ` by ${selectedAnnouncement.author.full_name}`}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: '#0F172A',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedAnnouncement.content}
              </Typography>
              {selectedAnnouncement.target_department_details &&
                selectedAnnouncement.target_department_details.length > 0 && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                      Targeted Departments:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      {selectedAnnouncement.target_department_details.map((dept) => (
                        <Chip key={dept.id} label={dept.name} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}
