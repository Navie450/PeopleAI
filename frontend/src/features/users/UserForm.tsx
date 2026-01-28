import { Box, Typography } from '@mui/material'

interface UserFormProps {
  mode: 'create' | 'edit'
}

export const UserForm: React.FC<UserFormProps> = ({ mode }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {mode === 'create' ? 'Create User' : 'Edit User'}
      </Typography>
      <Typography variant="body1">
        User form will be implemented here
      </Typography>
    </Box>
  )
}
