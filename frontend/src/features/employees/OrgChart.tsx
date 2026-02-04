import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Skeleton,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  Collapse,
  alpha,
} from '@mui/material'
import {
  ArrowBack,
  ExpandMore,
  ExpandLess,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  Search,
  Person,
} from '@mui/icons-material'
import { employeesApi } from '@/api/employees.api'
import type { OrgChartNode } from '@/types'

interface NodeCardProps {
  node: OrgChartNode
  level: number
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
  onNavigate: (id: string) => void
  searchQuery: string
}

const NodeCard = ({ node, level, expanded, onToggle, onNavigate, searchQuery }: NodeCardProps) => {
  const isExpanded = expanded[node.id] !== false
  const hasReports = node.direct_reports && node.direct_reports.length > 0
  const isHighlighted = searchQuery && node.full_name.toLowerCase().includes(searchQuery.toLowerCase())

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Node Card */}
      <Card
        sx={{
          minWidth: 200,
          maxWidth: 240,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: isHighlighted ? '2px solid #3B82F6' : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: isHighlighted
            ? '0 8px 24px rgba(59, 130, 246, 0.3)'
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 3,
          position: 'relative',
          bgcolor: '#FFFFFF',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
            borderColor: '#0F172A',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: level === 0
              ? 'linear-gradient(90deg, #0F172A, #3B82F6)'
              : level === 1
                ? 'linear-gradient(90deg, #3B82F6, #8B5CF6)'
                : 'linear-gradient(90deg, #64748B, #94A3B8)',
            borderRadius: '3px 3px 0 0',
          },
        }}
        onClick={() => onNavigate(node.id)}
      >
        <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
          <Avatar
            src={node.profile_picture_url}
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 1.5,
              bgcolor: '#0F172A',
              color: '#FFFFFF',
              fontSize: '1.25rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {node.full_name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.25 }}>
            {node.full_name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
            {node.job_title}
          </Typography>
          {node.department && (
            <Chip
              label={node.department}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: 'rgba(15, 23, 42, 0.08)',
                color: '#475569',
              }}
            />
          )}
          {hasReports && (
            <Box
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                {node.direct_reports?.length} direct report{node.direct_reports?.length !== 1 ? 's' : ''}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle(node.id)
                }}
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  width: 24,
                  height: 24,
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' },
                }}
              >
                {isExpanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Connector Line */}
      {hasReports && isExpanded && (
        <Box
          sx={{
            width: 2,
            height: 24,
            bgcolor: 'rgba(0, 0, 0, 0.15)',
            mt: 0.5,
          }}
        />
      )}

      {/* Children */}
      {hasReports && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              pt: 1,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: `calc(100% - ${200}px)`,
                height: 2,
                bgcolor: 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            {node.direct_reports?.map((child) => (
              <Box key={child.id} sx={{ position: 'relative' }}>
                {/* Vertical connector from horizontal line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 2,
                    height: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.1)',
                  }}
                />
                <NodeCard
                  node={child}
                  level={level + 1}
                  expanded={expanded}
                  onToggle={onToggle}
                  onNavigate={onNavigate}
                  searchQuery={searchQuery}
                />
              </Box>
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  )
}

export const OrgChart = () => {
  const navigate = useNavigate()
  const [orgChart, setOrgChart] = useState<OrgChartNode[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    const fetchOrgChart = async () => {
      try {
        const { data } = await employeesApi.getOrgChart()
        setOrgChart(data.data || [])

        // Auto-expand first two levels
        const initialExpanded: Record<string, boolean> = {}
        const expandNodes = (nodes: OrgChartNode[], depth: number) => {
          nodes.forEach((node) => {
            if (depth < 2) {
              initialExpanded[node.id] = true
              if (node.direct_reports) {
                expandNodes(node.direct_reports, depth + 1)
              }
            }
          })
        }
        expandNodes(data.data || [], 0)
        setExpanded(initialExpanded)
      } catch (error) {
        console.error('Failed to fetch org chart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrgChart()
  }, [])

  const handleToggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleNavigate = (id: string) => {
    navigate(`/employees/${id}`)
  }

  const expandAll = useCallback(() => {
    const allExpanded: Record<string, boolean> = {}
    const expandNodes = (nodes: OrgChartNode[]) => {
      nodes.forEach((node) => {
        allExpanded[node.id] = true
        if (node.direct_reports) {
          expandNodes(node.direct_reports)
        }
      })
    }
    expandNodes(orgChart)
    setExpanded(allExpanded)
  }, [orgChart])

  const collapseAll = () => {
    setExpanded({})
  }

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <Skeleton variant="rounded" width={240} height={180} sx={{ borderRadius: 3 }} />
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4, animation: 'fadeIn 0.5s ease-out' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/employees')}
          sx={{ mb: 2, color: '#64748B', fontWeight: 600 }}
        >
          Back to Employees
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Organization Chart
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
              Visual representation of your team structure
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search employee..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: 220,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#FFFFFF',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#94A3B8', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', bgcolor: '#F1F5F9', borderRadius: 2, p: 0.5 }}>
              <Tooltip title="Zoom Out">
                <IconButton
                  size="small"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  disabled={zoom <= 50}
                >
                  <ZoomOut sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ px: 1, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                {zoom}%
              </Typography>
              <Tooltip title="Zoom In">
                <IconButton
                  size="small"
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                  disabled={zoom >= 150}
                >
                  <ZoomIn sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Tooltip title="Reset View">
              <IconButton
                onClick={() => {
                  setZoom(100)
                  setSearchQuery('')
                }}
                sx={{ bgcolor: '#F1F5F9' }}
              >
                <CenterFocusStrong sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              onClick={expandAll}
              sx={{ borderColor: '#E2E8F0', color: '#475569', fontWeight: 600 }}
            >
              Expand All
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={collapseAll}
              sx={{ borderColor: '#E2E8F0', color: '#475569', fontWeight: 600 }}
            >
              Collapse All
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Org Chart Container */}
      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'auto',
          minHeight: 500,
          animation: 'fadeIn 0.5s ease-out 0.1s both',
        }}
      >
        <CardContent
          sx={{
            p: 4,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s ease',
          }}
        >
          {orgChart.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
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
                <Person sx={{ fontSize: 40, color: '#64748B' }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#64748B', fontWeight: 600 }}>
                No organization structure found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add employees with manager relationships to build your org chart
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {orgChart.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  level={0}
                  expanded={expanded}
                  onToggle={handleToggle}
                  onNavigate={handleNavigate}
                  searchQuery={searchQuery}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Box sx={{ mt: 3, display: 'flex', gap: 3, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 24, height: 4, background: 'linear-gradient(90deg, #0F172A, #3B82F6)', borderRadius: 2 }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Top Level</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 24, height: 4, background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', borderRadius: 2 }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Management</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 24, height: 4, background: 'linear-gradient(90deg, #64748B, #94A3B8)', borderRadius: 2 }} />
          <Typography variant="caption" sx={{ color: '#64748B' }}>Team Members</Typography>
        </Box>
      </Box>
    </Box>
  )
}
