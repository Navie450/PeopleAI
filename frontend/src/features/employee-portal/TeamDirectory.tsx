import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Skeleton,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { employeesApi } from '@/api/employees.api'
import { departmentsApi } from '@/api/departments.api'
import type { EmployeeListItem, Department } from '@/types'
import { ColleagueCard } from './components'

export const TeamDirectory = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<EmployeeListItem[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 12

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [search, departmentFilter, page])

  const fetchDepartments = async () => {
    try {
      const response = await departmentsApi.list()
      setDepartments(response.data.data)
    } catch (error) {
      // Silently fail - departments filter will just be empty
    }
  }

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await employeesApi.search(search || '', limit)
      // Note: The search API doesn't support pagination well, so we're using basic search
      // In a real app, you'd use the list API with proper pagination
      setEmployees(response.data.data)
      setTotalPages(1) // Simplified - would need proper pagination from API
    } catch (error) {
      enqueueSnackbar('Failed to load team directory', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleEmployeeClick = (id: string) => {
    // Regular users can view colleague profiles
    // For now, we'll just show a message since we don't have a public profile view
    enqueueSnackbar('Profile viewing coming soon', { variant: 'info' })
  }

  const filteredEmployees = departmentFilter
    ? employees.filter((e) => e.department?.id === departmentFilter)
    : employees

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        Team Directory
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          placeholder="Search colleagues..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          sx={{ flex: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#64748B' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={departmentFilter}
            label="Department"
            onChange={(e) => {
              setDepartmentFilter(e.target.value)
              setPage(1)
            }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Employee Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredEmployees.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {filteredEmployees.map((employee, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={employee.id}
                sx={{
                  animation: 'fadeIn 0.5s ease-out',
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <ColleagueCard employee={employee} onClick={handleEmployeeClick} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
            No colleagues found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </Box>
  )
}
