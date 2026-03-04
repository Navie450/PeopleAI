import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  Skeleton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { leaveRequestsApi } from '@/api/leave-requests.api'
import type { LeaveRequestListItem, LeaveBalanceSummary, CreateLeaveRequestDto } from '@/types'
import { LeaveBalanceCard, LeaveRequestCard, LeaveRequestForm } from './components'

export const MyLeave = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestListItem[]>([])
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceSummary[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [requestsRes, balancesRes] = await Promise.all([
        leaveRequestsApi.getMyLeaveRequests({ sort_by: 'created_at', sort_order: 'desc' }),
        leaveRequestsApi.getMyLeaveBalances(),
      ])
      setLeaveRequests(requestsRes.data.data)
      setLeaveBalances(balancesRes.data.data)
    } catch (error) {
      enqueueSnackbar('Failed to load leave data', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRequest = async (data: CreateLeaveRequestDto) => {
    try {
      setFormLoading(true)
      await leaveRequestsApi.create(data)
      enqueueSnackbar('Leave request submitted successfully', { variant: 'success' })
      setFormOpen(false)
      fetchData()
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to submit leave request', { variant: 'error' })
    } finally {
      setFormLoading(false)
    }
  }

  const handleCancelRequest = async () => {
    if (!selectedRequestId) return

    try {
      setCancelling(true)
      await leaveRequestsApi.cancel(selectedRequestId)
      enqueueSnackbar('Leave request cancelled', { variant: 'success' })
      setCancelDialogOpen(false)
      setSelectedRequestId(null)
      fetchData()
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to cancel request', { variant: 'error' })
    } finally {
      setCancelling(false)
    }
  }

  const openCancelDialog = (id: string) => {
    setSelectedRequestId(id)
    setCancelDialogOpen(true)
  }

  const filterRequests = (status: string | null) => {
    if (!status) return leaveRequests
    return leaveRequests.filter((r) => r.status === status)
  }

  const pendingRequests = filterRequests('pending')
  const approvedRequests = filterRequests('approved')
  const rejectedOrCancelled = leaveRequests.filter((r) => r.status === 'rejected' || r.status === 'cancelled')

  const getTabRequests = () => {
    switch (tabValue) {
      case 0:
        return leaveRequests
      case 1:
        return pendingRequests
      case 2:
        return approvedRequests
      case 3:
        return rejectedOrCancelled
      default:
        return leaveRequests
    }
  }

  const balanceColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4']

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
          My Leave
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{
            backgroundColor: '#0F172A',
            '&:hover': { backgroundColor: '#1E293B' },
          }}
        >
          Request Leave
        </Button>
      </Box>

      {/* Leave Balances */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2 }}>
        Leave Balances
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
          ))
        ) : (
          leaveBalances.map((balance, index) => (
            <Grid item xs={12} sm={6} md={3} key={balance.leave_type}>
              <LeaveBalanceCard
                balance={balance}
                color={balanceColors[index % balanceColors.length]}
              />
            </Grid>
          ))
        )}
      </Grid>

      {/* Leave Requests */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 2 }}>
        Leave Requests
      </Typography>
      <Card
        sx={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 3,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            <Tab label={`All (${leaveRequests.length})`} />
            <Tab label={`Pending (${pendingRequests.length})`} />
            <Tab label={`Approved (${approvedRequests.length})`} />
            <Tab label={`Rejected/Cancelled (${rejectedOrCancelled.length})`} />
          </Tabs>
        </Box>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 3 }} />
              ))}
            </Box>
          ) : getTabRequests().length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {getTabRequests().map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={request}
                  onCancel={openCancelDialog}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" sx={{ color: '#64748B' }}>
                No leave requests found
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Leave Request Form Dialog */}
      <LeaveRequestForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitRequest}
        loading={formLoading}
      />

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel Leave Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this leave request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
            No, Keep It
          </Button>
          <Button
            onClick={handleCancelRequest}
            color="error"
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
