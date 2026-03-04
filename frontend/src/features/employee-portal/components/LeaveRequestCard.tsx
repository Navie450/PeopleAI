import { Box, Card, CardContent, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import { Cancel as CancelIcon, Event as EventIcon } from '@mui/icons-material'
import type { LeaveRequestListItem } from '@/types'
import { leaveTypeLabels, leaveStatusLabels, leaveStatusColors } from '@/types'

interface LeaveRequestCardProps {
  request: LeaveRequestListItem
  onCancel?: (id: string) => void
  showActions?: boolean
}

export const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({
  request,
  onCancel,
  showActions = true,
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ color: '#64748B', fontSize: 20 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F172A' }}>
              {leaveTypeLabels[request.leave_type]}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={leaveStatusLabels[request.status]}
              color={leaveStatusColors[request.status]}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            {showActions && request.status === 'pending' && onCancel && (
              <Tooltip title="Cancel Request">
                <IconButton
                  size="small"
                  onClick={() => onCancel(request.id)}
                  sx={{ color: '#EF4444' }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
              From
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
              {formatDate(request.start_date)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
              To
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
              {formatDate(request.end_date)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
              Duration
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
              {request.total_days} day{request.total_days !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        {request.reason && (
          <Typography variant="body2" sx={{ color: '#64748B', fontStyle: 'italic' }}>
            "{request.reason}"
          </Typography>
        )}

        {request.reviewer_comments && (
          <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#F8FAFC', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
              Reviewer Comment:
            </Typography>
            <Typography variant="body2" sx={{ color: '#0F172A' }}>
              {request.reviewer_comments}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
