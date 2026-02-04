import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  alpha,
  Fade,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Collapse,
  Paper,
} from '@mui/material'
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  People,
  LocationOn,
  AccountTree,
  TrendingUp,
  GridView,
  ExpandMore,
  ExpandLess,
  FolderOpen,
  Folder,
} from '@mui/icons-material'
import { departmentsApi } from '@/api/departments.api'
import { useNavigate } from 'react-router-dom'
import type { DepartmentListItem, DepartmentHierarchy } from '@/types'

// Hierarchy Tree Node Component
interface HierarchyNodeProps {
  node: DepartmentHierarchy
  level: number
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
  onNavigate: (id: string) => void
}

const HierarchyNode = ({ node, level, expanded, onToggle, onNavigate }: HierarchyNodeProps) => {
  const isExpanded = expanded[node.id] !== false
  const hasChildren = node.children && node.children.length > 0

  return (
    <Box sx={{ ml: level * 3 }}>
      <Paper
        sx={{
          p: 2,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
          borderRadius: 2,
          border: '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(15, 23, 42, 0.04)',
            borderColor: '#0F172A',
            transform: 'translateX(4px)',
          },
        }}
        onClick={() => onNavigate(node.id)}
      >
        {hasChildren && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
            sx={{ p: 0.5 }}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 28 }} />}
        {hasChildren ? (
          <FolderOpen sx={{ color: '#F59E0B', fontSize: 24 }} />
        ) : (
          <Folder sx={{ color: '#64748B', fontSize: 24 }} />
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
            {node.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            {node.employee_count || 0} employees
          </Typography>
        </Box>
        <Chip
          label={node.code}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 700,
            bgcolor: 'rgba(15, 23, 42, 0.08)',
            color: '#475569',
          }}
        />
      </Paper>
      {hasChildren && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          {node.children?.map((child) => (
            <HierarchyNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </Collapse>
      )}
    </Box>
  )
}

export const DepartmentList = () => {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState<DepartmentListItem[]>([])
  const [hierarchy, setHierarchy] = useState<DepartmentHierarchy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'hierarchy'>('grid')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedDept, setSelectedDept] = useState<DepartmentListItem | null>(null)

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const [listRes, hierarchyRes] = await Promise.all([
        departmentsApi.list({ limit: 50 }),
        departmentsApi.getHierarchy(),
      ])
      setDepartments(listRes.data.data || [])
      setHierarchy(hierarchyRes.data.data || [])

      // Auto-expand first level
      const initialExpanded: Record<string, boolean> = {}
      hierarchyRes.data.data?.forEach((dept: DepartmentHierarchy) => {
        initialExpanded[dept.id] = true
      })
      setExpanded(initialExpanded)
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleToggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, dept: DepartmentListItem) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedDept(dept)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedDept(null)
  }

  const handleEdit = () => {
    if (selectedDept) {
      navigate(`/departments/${selectedDept.id}/edit`)
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (selectedDept && window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentsApi.delete(selectedDept.id)
        fetchDepartments()
      } catch (error) {
        console.error('Failed to delete department:', error)
      }
    }
    handleMenuClose()
  }

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const colors = ['#0F172A', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16']

  return (
    <Box
      sx={{
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          animation: 'fadeInUp 0.5s ease-out',
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              mb: 0.5,
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 800,
              color: '#0F172A',
            }}
          >
            Departments
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
            Manage your organization structure
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
            sx={{
              bgcolor: '#F1F5F9',
              borderRadius: 2,
              p: 0.5,
              '& .MuiToggleButton-root': {
                color: '#64748B',
                border: 'none',
                borderRadius: '6px !important',
                px: 2,
                '&.Mui-selected': {
                  bgcolor: '#FFFFFF',
                  color: '#0F172A',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#FFFFFF' },
                },
              },
            }}
          >
            <ToggleButton value="grid">
              <Tooltip title="Grid View">
                <GridView fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="hierarchy">
              <Tooltip title="Hierarchy View">
                <AccountTree fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<AccountTree />}
            onClick={() => navigate('/employees/org-chart')}
            sx={{
              borderColor: '#E2E8F0',
              color: '#475569',
              borderRadius: 2,
              px: 2.5,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { borderColor: '#0F172A' },
            }}
          >
            Org Chart
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/departments/new')}
            sx={{
              bgcolor: '#0F172A',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              '&:hover': { bgcolor: '#1a2236', transform: 'translateY(-2px)' },
              transition: 'all 0.2s',
            }}
          >
            Add Department
          </Button>
        </Stack>
      </Box>

      {/* Search */}
      <Card
        sx={{
          mb: 3,
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 4,
          animation: 'fadeInUp 0.5s ease-out 0.1s both',
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <TextField
            fullWidth
            placeholder="Search departments by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#F1F5F9',
                borderRadius: 50,
                '& fieldset': { borderColor: '#E2E8F0' },
                '&:hover fieldset': { borderColor: '#CBD5E1' },
                '&.Mui-focused fieldset': { borderColor: '#0F172A' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94A3B8' }} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Department Count */}
      <Box sx={{ mb: 3, animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {filteredDepartments.length} department{filteredDepartments.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Departments Content */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredDepartments.length === 0 ? (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(15, 23, 42, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Add sx={{ fontSize: 40, color: '#0F172A' }} />
            </Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
              No departments found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first department to organize your team
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/departments/new')}
              sx={{
                bgcolor: '#0F172A',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#1a2236' },
              }}
            >
              Create Department
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'hierarchy' ? (
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            animation: 'fadeInUp 0.5s ease-out 0.3s both',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Department Hierarchy
            </Typography>
            {hierarchy.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hierarchy data available
              </Typography>
            ) : (
              hierarchy.map((node) => (
                <HierarchyNode
                  key={node.id}
                  node={node}
                  level={0}
                  expanded={expanded}
                  onToggle={handleToggleExpand}
                  onNavigate={(id) => navigate(`/departments/${id}`)}
                />
              ))
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3} sx={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
          {filteredDepartments.map((dept, index) => (
            <Grid item xs={12} sm={6} md={4} key={dept.id}>
              <Fade in timeout={300 + index * 50}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: 4,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      borderColor: '#0F172A',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})`,
                    },
                  }}
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>
                          {dept.name}
                        </Typography>
                        <Chip
                          label={dept.code}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: alpha(colors[index % colors.length], 0.1),
                            color: colors[index % colors.length],
                          }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, dept)}
                        sx={{ color: '#94A3B8' }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>

                    {dept.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748B',
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {dept.description}
                      </Typography>
                    )}

                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People sx={{ fontSize: 18, color: '#64748B' }} />
                        <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                          {dept.employee_count || 0} employee{(dept.employee_count || 0) !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      {dept.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: '#64748B' }} />
                          <Typography variant="body2" sx={{ color: '#64748B' }}>
                            {dept.location}
                          </Typography>
                        </Box>
                      )}
                      {dept.manager_name && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{ fontSize: 18, color: '#64748B' }} />
                          <Typography variant="body2" sx={{ color: '#64748B' }}>
                            Led by {dept.manager_name}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <Chip
                        label={dept.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          bgcolor: dept.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: dept.is_active ? '#10B981' : '#EF4444',
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: 160 },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: '#475569' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ py: 1.5, color: '#EF4444' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#EF4444' }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
