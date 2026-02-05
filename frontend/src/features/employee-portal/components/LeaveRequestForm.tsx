import { useState } from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
} from '@mui/material'
import type { LeaveType, CreateLeaveRequestDto } from '@/types'
import { leaveTypeLabels } from '@/types'

interface LeaveRequestFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateLeaveRequestDto) => void
  loading?: boolean
}

const leaveTypes: LeaveType[] = [
  'annual',
  'sick',
  'personal',
  'maternity',
  'paternity',
  'bereavement',
  'unpaid',
  'compensatory',
  'other',
]

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('annual')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const handleSubmit = () => {
    setError('')

    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      setError('Start date must be before end date')
      return
    }

    if (start < new Date(new Date().toDateString())) {
      setError('Cannot request leave for past dates')
      return
    }

    const totalDays = calculateTotalDays()

    onSubmit({
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      reason: reason || undefined,
    })
  }

  const handleClose = () => {
    setLeaveType('annual')
    setStartDate('')
    setEndDate('')
    setReason('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Request Leave</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={leaveType}
              label="Leave Type"
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            >
              {leaveTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {leaveTypeLabels[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: startDate || new Date().toISOString().split('T')[0] }}
            />
          </Box>

          {startDate && endDate && (
            <Box
              sx={{
                p: 2,
                backgroundColor: '#F8FAFC',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {calculateTotalDays()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                day{calculateTotalDays() !== 1 ? 's' : ''} requested
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Reason (Optional)"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter a reason for your leave request..."
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
