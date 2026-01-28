import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { useState } from 'react'

const SIDEBAR_WIDTH = 320

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} sidebarWidth={SIDEBAR_WIDTH} />
      <Sidebar open={sidebarOpen} width={SIDEBAR_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 1,
          pr: 4,
          pb: 4,
          pl: 4,
          mt: 8,
          backgroundColor: '#FFFFFF',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
