import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  alpha,
} from '@mui/material'
import { Edit as EditIcon, Flag as FlagIcon } from '@mui/icons-material'
import type { PerformanceGoal } from '@/types'

interface GoalProgressCardProps {
  goal: PerformanceGoal
  onUpdate?: (goalId: string, progress: number, status: string) => void
}

const statusColors: Record<string, { bg: string; text: string }> = {
  not_started: { bg: '#64748B', text: '#FFFFFF' },
  in_progress: { bg: '#3B82F6', text: '#FFFFFF' },
  completed: { bg: '#10B981', text: '#FFFFFF' },
  cancelled: { bg: '#EF4444', text: '#FFFFFF' },
}

const statusLabels: Record<string, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, onUpdate }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [progress, setProgress] = useState(goal.progress_percentage)
  const [status, setStatus] = useState(goal.status)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(goal.id, progress, status)
    }
    setEditDialogOpen(false)
  }

  const isOverdue = new Date(goal.target_date) < new Date() && goal.status !== 'completed'

  return (
    <>
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
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlagIcon sx={{ color: statusColors[goal.status].bg, fontSize: 20 }} />
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F172A' }}>
                {goal.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={statusLabels[goal.status]}
                size="small"
                sx={{
                  backgroundColor: statusColors[goal.status].bg,
                  color: statusColors[goal.status].text,
                  fontWeight: 600,
                }}
              />
              {onUpdate && goal.status !== 'completed' && goal.status !== 'cancelled' && (
                <Tooltip title="Update Progress">
                  <IconButton size="small" onClick={() => setEditDialogOpen(true)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
            {goal.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B' }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {goal.progress_percentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={goal.progress_percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(statusColors[goal.status].bg, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: statusColors[goal.status].bg,
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Target: {formatDate(goal.target_date)}
            </Typography>
            {isOverdue && (
              <Chip label="Overdue" size="small" color="error" sx={{ fontWeight: 600 }} />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Edit Progress Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Goal Progress</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
              {goal.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Progress: {progress}%
            </Typography>
            <Slider
              value={progress}
              onChange={(_, value) => setProgress(value as number)}
              min={0}
              max={100}
              sx={{ mt: 1 }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ color: '#64748B', mb: 1, display: 'block' }}>
                Status
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['not_started', 'in_progress', 'completed'].map((s) => (
                  <Chip
                    key={s}
                    label={statusLabels[s]}
                    onClick={() => setStatus(s as PerformanceGoal['status'])}
                    sx={{
                      backgroundColor: status === s ? statusColors[s].bg : 'transparent',
                      color: status === s ? statusColors[s].text : '#64748B',
                      border: `1px solid ${statusColors[s].bg}`,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
