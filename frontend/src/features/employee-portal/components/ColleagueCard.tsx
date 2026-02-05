import { Box, Card, CardContent, Typography, Avatar, Chip, alpha } from '@mui/material'
import { Email as EmailIcon, Phone as PhoneIcon, Business as BusinessIcon } from '@mui/icons-material'
import type { EmployeeListItem } from '@/types'

interface ColleagueCardProps {
  employee: EmployeeListItem
  onClick?: (id: string) => void
}

export const ColleagueCard: React.FC<ColleagueCardProps> = ({ employee, onClick }) => {
  const initials = `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase()

  return (
    <Card
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
        cursor: onClick ? 'pointer' : 'default',
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
      }}
      onClick={() => onClick?.(employee.id)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={employee.profile_picture_url}
            sx={{
              width: 56,
              height: 56,
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            {!employee.profile_picture_url && initials}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
              {employee.full_name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              {employee.job_title}
            </Typography>
          </Box>
        </Box>

        {employee.department && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <BusinessIcon sx={{ fontSize: 16, color: '#64748B' }} />
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              {employee.department.name}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <EmailIcon sx={{ fontSize: 16, color: '#64748B' }} />
          <Typography
            variant="body2"
            sx={{
              color: '#3B82F6',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
            component="a"
            href={`mailto:${employee.work_email}`}
            onClick={(e) => e.stopPropagation()}
          >
            {employee.work_email}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Chip
            label={employee.employment_status.replace('_', ' ')}
            size="small"
            sx={{
              backgroundColor: employee.employment_status === 'active'
                ? alpha('#10B981', 0.1)
                : alpha('#64748B', 0.1),
              color: employee.employment_status === 'active' ? '#10B981' : '#64748B',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          />
          {employee.is_remote && (
            <Chip
              label="Remote"
              size="small"
              sx={{
                backgroundColor: alpha('#3B82F6', 0.1),
                color: '#3B82F6',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
