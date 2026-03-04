import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
  Button,
  TextField,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
} from '@mui/material'
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { employeesApi } from '@/api/employees.api'
import type { Employee, EmergencyContact } from '@/types'

export const MyProfile = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Employee | null>(null)
  const [editingContact, setEditingContact] = useState(false)
  const [editingEmergency, setEditingEmergency] = useState(false)
  const [saving, setSaving] = useState(false)

  // Contact info form state
  const [contactForm, setContactForm] = useState({
    personal_email: '',
    personal_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  })

  // Emergency contacts form state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await employeesApi.getMyProfile()
      const data = response.data.data
      if (data) {
        setProfile(data)
        setContactForm({
          personal_email: data.personal_email || '',
          personal_phone: data.personal_phone || '',
          address_line1: data.address?.line1 || '',
          address_line2: data.address?.line2 || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          postal_code: data.address?.postal_code || '',
          country: data.address?.country || '',
        })
        setEmergencyContacts(data.emergency_contacts || [])
      }
    } catch (error) {
      enqueueSnackbar('Failed to load profile', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveContactInfo = async () => {
    try {
      setSaving(true)
      await employeesApi.updateMyContactInfo(contactForm)
      enqueueSnackbar('Contact information updated successfully', { variant: 'success' })
      setEditingContact(false)
      fetchProfile()
    } catch (error) {
      enqueueSnackbar('Failed to update contact information', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEmergencyContacts = async () => {
    try {
      setSaving(true)
      await employeesApi.updateMyEmergencyContacts(emergencyContacts)
      enqueueSnackbar('Emergency contacts updated successfully', { variant: 'success' })
      setEditingEmergency(false)
      fetchProfile()
    } catch (error) {
      enqueueSnackbar('Failed to update emergency contacts', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={200} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={300} />
      </Box>
    )
  }

  if (!profile) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
          My Profile
        </Typography>
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: '#64748B', mb: 2 }}>
            No Employee Profile Found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Your user account is not linked to an employee record. This is common for administrator accounts.
            Contact HR if you believe this is an error.
          </Typography>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: 120,
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              }}
            />
            <CardContent sx={{ position: 'relative', pt: 0, pb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <Avatar
                  src={profile.profile_picture_url}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid #FFFFFF',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    mt: -8,
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                  }}
                >
                  {!profile.profile_picture_url && `${profile.first_name[0]}${profile.last_name[0]}`}
                </Avatar>
                <Box sx={{ flex: 1, pt: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    {profile.full_name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748B', mb: 2 }}>
                    {profile.job_title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<BadgeIcon />}
                      label={profile.employee_id}
                      sx={{
                        backgroundColor: alpha('#0F172A', 0.1),
                        fontWeight: 600,
                      }}
                    />
                    {profile.department && (
                      <Chip
                        icon={<BusinessIcon />}
                        label={profile.department.name}
                        sx={{
                          backgroundColor: alpha('#3B82F6', 0.1),
                          color: '#3B82F6',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    <Chip
                      label={`${profile.years_of_service} years of service`}
                      sx={{
                        backgroundColor: alpha('#10B981', 0.1),
                        color: '#10B981',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Information */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 3 }}>
                Work Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <EmailIcon sx={{ color: '#64748B' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Work Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.work_email}
                    </Typography>
                  </Box>
                </Box>
                {profile.work_phone && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <PhoneIcon sx={{ color: '#64748B' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Work Phone
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profile.work_phone}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {profile.work_location && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LocationIcon sx={{ color: '#64748B' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Work Location
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profile.work_location}
                        {profile.is_remote && ' (Remote)'}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {profile.manager && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <PersonIcon sx={{ color: '#64748B' }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Reports To
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profile.manager.full_name}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Contact Information */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  Personal Contact
                </Typography>
                <IconButton onClick={() => setEditingContact(true)}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <EmailIcon sx={{ color: '#64748B' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Personal Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.personal_email || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <PhoneIcon sx={{ color: '#64748B' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Personal Phone
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.personal_phone || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LocationIcon sx={{ color: '#64748B' }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {profile.address?.line1 ? (
                        <>
                          {profile.address.line1}
                          {profile.address.line2 && `, ${profile.address.line2}`}
                          <br />
                          {profile.address.city}, {profile.address.state} {profile.address.postal_code}
                          <br />
                          {profile.address.country}
                        </>
                      ) : (
                        'Not provided'
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contacts */}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  Emergency Contacts
                </Typography>
                <IconButton onClick={() => setEditingEmergency(true)}>
                  <EditIcon />
                </IconButton>
              </Box>
              {profile.emergency_contacts && profile.emergency_contacts.length > 0 ? (
                <Grid container spacing={2}>
                  {profile.emergency_contacts.map((contact, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#F8FAFC',
                          borderRadius: 2,
                          border: contact.is_primary ? '2px solid #10B981' : '1px solid rgba(0, 0, 0, 0.06)',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F172A' }}>
                            {contact.name}
                          </Typography>
                          {contact.is_primary && (
                            <Chip label="Primary" size="small" color="success" sx={{ fontWeight: 600 }} />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                          {contact.relationship}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#0F172A', mt: 1 }}>
                          {contact.phone}
                        </Typography>
                        {contact.email && (
                          <Typography variant="body2" sx={{ color: '#3B82F6' }}>
                            {contact.email}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  No emergency contacts added
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Contact Info Dialog */}
      <Dialog open={editingContact} onClose={() => setEditingContact(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Contact Information</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Personal Email"
              type="email"
              fullWidth
              value={contactForm.personal_email}
              onChange={(e) => setContactForm({ ...contactForm, personal_email: e.target.value })}
            />
            <TextField
              label="Personal Phone"
              fullWidth
              value={contactForm.personal_phone}
              onChange={(e) => setContactForm({ ...contactForm, personal_phone: e.target.value })}
            />
            <Divider sx={{ my: 1 }} />
            <TextField
              label="Address Line 1"
              fullWidth
              value={contactForm.address_line1}
              onChange={(e) => setContactForm({ ...contactForm, address_line1: e.target.value })}
            />
            <TextField
              label="Address Line 2"
              fullWidth
              value={contactForm.address_line2}
              onChange={(e) => setContactForm({ ...contactForm, address_line2: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="City"
                fullWidth
                value={contactForm.city}
                onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
              />
              <TextField
                label="State"
                fullWidth
                value={contactForm.state}
                onChange={(e) => setContactForm({ ...contactForm, state: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Postal Code"
                fullWidth
                value={contactForm.postal_code}
                onChange={(e) => setContactForm({ ...contactForm, postal_code: e.target.value })}
              />
              <TextField
                label="Country"
                fullWidth
                value={contactForm.country}
                onChange={(e) => setContactForm({ ...contactForm, country: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setEditingContact(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSaveContactInfo} variant="contained" disabled={saving} startIcon={<SaveIcon />}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Emergency Contacts Dialog */}
      <Dialog open={editingEmergency} onClose={() => setEditingEmergency(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Emergency Contacts</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {emergencyContacts.map((contact, index) => (
              <Box key={index} sx={{ p: 2, backgroundColor: '#F8FAFC', borderRadius: 2, position: 'relative' }}>
                <IconButton
                  size="small"
                  onClick={() => setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index))}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Name"
                      fullWidth
                      size="small"
                      value={contact.name}
                      onChange={(e) => {
                        const updated = [...emergencyContacts]
                        updated[index] = { ...contact, name: e.target.value }
                        setEmergencyContacts(updated)
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Relationship"
                      fullWidth
                      size="small"
                      value={contact.relationship}
                      onChange={(e) => {
                        const updated = [...emergencyContacts]
                        updated[index] = { ...contact, relationship: e.target.value }
                        setEmergencyContacts(updated)
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Phone"
                      fullWidth
                      size="small"
                      value={contact.phone}
                      onChange={(e) => {
                        const updated = [...emergencyContacts]
                        updated[index] = { ...contact, phone: e.target.value }
                        setEmergencyContacts(updated)
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      size="small"
                      value={contact.email || ''}
                      onChange={(e) => {
                        const updated = [...emergencyContacts]
                        updated[index] = { ...contact, email: e.target.value }
                        setEmergencyContacts(updated)
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() =>
                setEmergencyContacts([
                  ...emergencyContacts,
                  { name: '', relationship: '', phone: '', email: '', is_primary: emergencyContacts.length === 0 },
                ])
              }
            >
              Add Contact
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setEditingEmergency(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSaveEmergencyContacts} variant="contained" disabled={saving} startIcon={<SaveIcon />}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
