import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  CheckCircle,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


interface NavbarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
  sidebarWidth: number
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, sidebarOpen, sidebarWidth }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleLogout = () => {
    logout()
    setAnchorEl(null)
  }

  const handleProfile = () => {
    navigate('/profile')
    setAnchorEl(null)
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        color: '#0F172A',
        width: { md: sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%' },
        ml: { md: sidebarOpen ? `${sidebarWidth}px` : 0 },
        transition: 'all 0.3s ease-in-out',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* Menu Toggle */}
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, color: '#0F172A' }}
        >
          <MenuIcon />
        </IconButton>


        <Box sx={{ flexGrow: 1 }} />

        {/* Enterprise Mode Status */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            mr: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}
          >
            Enterprise Mode
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: '#2563EB',
            color: 'white'
          }}>
            <CheckCircle sx={{ fontSize: 14 }} />
          </Box>
        </Box>

        {/* Notifications */}
        <IconButton sx={{ color: '#0F172A', mr: 1 }}>
          <Badge
            badgeContent=""
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#EF4444',
                minWidth: 10,
                height: 10,
                top: 2,
                right: 2,
                border: '2px solid #FFFFFF'
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* User Menu */}
        <Box>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              p: 0.5,
              border: '2px solid rgba(0, 0, 0, 0.05)',
              '&:hover': {
                borderColor: '#2563EB',
              },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'rgba(37, 99, 235, 0.15)',
                color: '#2563EB',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 240,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                bgcolor: '#FFFFFF', // keep menu white for legibility
              },
            }}
          >
            {/* User Info Header */}
            <Box sx={{ px: 2, py: 1.5, pb: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#0F172A' }}
              >
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : 'User'}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#64748B' }}
              >
                {user?.email}
              </Typography>
            </Box>
            <Divider />

            {/* Menu Items */}
            <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar >
  )
}
