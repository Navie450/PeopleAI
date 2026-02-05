import { Box, Card, CardContent, Typography, LinearProgress, alpha } from '@mui/material'
import type { LeaveBalanceSummary } from '@/types'

interface LeaveBalanceCardProps {
  balance: LeaveBalanceSummary
  color?: string
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  balance,
  color = '#3B82F6'
}) => {
  const usedPercentage = balance.total_days > 0
    ? Math.min(((balance.used_days + balance.pending_days) / balance.total_days) * 100, 100)
    : 0

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
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#0F172A',
              textTransform: 'capitalize',
            }}
          >
            {balance.leave_type.replace('_', ' ')}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: color,
            }}
          >
            {balance.available_days}
            <Typography component="span" sx={{ fontSize: '0.75rem', color: '#64748B', ml: 0.5 }}>
              days left
            </Typography>
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={usedPercentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: alpha(color, 0.1),
            mb: 2,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
              borderRadius: 4,
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 500 }}>Used: </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>{balance.used_days}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 500 }}>Pending: </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#F59E0B' }}>{balance.pending_days}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 500 }}>Total: </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>{balance.total_days}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
