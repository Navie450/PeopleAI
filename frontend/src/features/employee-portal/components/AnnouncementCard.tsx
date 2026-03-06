import { Box, Card, CardContent, Typography, Chip, alpha } from '@mui/material'
import {
  Campaign as CampaignIcon,
  PushPin as PushPinIcon,
} from '@mui/icons-material'
import type { AnnouncementListItem } from '@/types'
import { announcementTypeLabels, announcementPriorityColors, announcementTypeColors } from '@/types'

interface AnnouncementCardProps {
  announcement: AnnouncementListItem
  onClick?: (id: string) => void
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onClick }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const typeColor = announcementTypeColors[announcement.type]

  return (
    <Card
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: onClick ? '0 8px 24px rgba(0, 0, 0, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: typeColor,
        },
      }}
      onClick={() => onClick?.(announcement.id)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CampaignIcon sx={{ color: typeColor, fontSize: 20 }} />
            {announcement.is_pinned && (
              <PushPinIcon sx={{ color: '#F59E0B', fontSize: 16, transform: 'rotate(45deg)' }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={announcementTypeLabels[announcement.type]}
              size="small"
              sx={{
                backgroundColor: alpha(typeColor, 0.1),
                color: typeColor,
                fontWeight: 600,
              }}
            />
            <Chip
              label={announcement.priority}
              color={announcementPriorityColors[announcement.priority]}
              size="small"
              sx={{ fontWeight: 600, textTransform: 'capitalize' }}
            />
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#0F172A',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {announcement.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#64748B',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {announcement.content}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            {formatDate(announcement.created_at)}
          </Typography>
          {announcement.author && (
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              by {announcement.author.full_name}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
