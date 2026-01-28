import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Avatar,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import logo from '@/assets/peopleai-logo.png'

interface SidebarProps {
  open: boolean
  width: number
}

export const Sidebar: React.FC<SidebarProps> = ({ open, width }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Users', icon: <PeopleIcon />, path: '/users' },
    { label: 'Security', icon: <SecurityIcon />, path: '/security' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: '#0F172A',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          pb: 3,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="PeopleAI Logo"
          sx={{
            height: 32,
            width: 'auto',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#FFFFFF',
            fontSize: '1.25rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          PeopleAI
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 1 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1.5 }}>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1.5,
                  py: 1.25,
                  px: 1.5,
                  color: 'rgba(255, 255, 255, 0.65)',
                  position: 'relative',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    '& .MuiListItemIcon-root': {
                      color: '#FFFFFF',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -16,
                      top: '15%',
                      height: '70%',
                      width: 4,
                      background: '#FFFFFF',
                      borderRadius: '0 4px 4px 0',
                      boxShadow: '2px 0 12px rgba(255, 255, 255, 0.4)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    transform: 'translateX(2px)',
                    '& .MuiListItemIcon-root': {
                      color: '#93C5FD',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.925rem',
                    fontWeight: isActive(item.path) ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          mt: 'auto'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s',
            cursor: 'pointer',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.06)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <Avatar
            sx={{
              background: '#FFFFFF',
              color: '#0F172A',
              width: 36,
              height: 36,
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: '#FFFFFF',
                fontSize: '0.875rem',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}
              noWrap
            >
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : 'Admin User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.7rem',
                fontWeight: 500
              }}
              noWrap
            >
              {user?.email || 'admin@peopleai.io'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}
