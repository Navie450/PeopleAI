import { http, HttpResponse } from 'msw'

const BASE_URL = 'http://localhost:5001/api/v1'

const mockUser = {
  id: 'user-uuid-1',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  display_name: 'John Doe',
  roles: ['user'],
  is_active: true,
  email_verified: true,
  created_at: '2024-01-01T00:00:00Z',
}

const mockTokens = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 900,
  token_type: 'Bearer',
}

const mockEmployee = {
  id: 'emp-uuid-1',
  employee_id: 'EMP001',
  first_name: 'John',
  last_name: 'Doe',
  full_name: 'John Doe',
  work_email: 'john@company.com',
  job_title: 'Software Engineer',
  employment_status: 'active',
  employment_type: 'full_time',
  hire_date: '2022-01-15',
  is_remote: false,
  created_at: '2022-01-15T00:00:00Z',
}

const mockDepartment = {
  id: 'dept-uuid-1',
  name: 'Engineering',
  code: 'ENG',
  description: 'Engineering department',
  employee_count: 10,
  is_active: true,
}

export const handlers = [
  // Auth handlers
  http.post(`${BASE_URL}/auth/login`, async () => {
    return HttpResponse.json({
      success: true,
      data: { tokens: mockTokens, user: mockUser },
      message: 'Login successful',
    })
  }),

  http.post(`${BASE_URL}/auth/register`, async () => {
    return HttpResponse.json(
      {
        success: true,
        data: { tokens: mockTokens, user: mockUser },
        message: 'Registration successful',
      },
      { status: 201 }
    )
  }),

  http.post(`${BASE_URL}/auth/refresh`, async () => {
    return HttpResponse.json({
      success: true,
      data: { tokens: { ...mockTokens, access_token: 'new-access-token' } },
    })
  }),

  http.get(`${BASE_URL}/auth/me`, async () => {
    return HttpResponse.json({
      success: true,
      data: mockUser,
    })
  }),

  http.post(`${BASE_URL}/auth/logout`, async () => {
    return HttpResponse.json({ success: true, message: 'Logged out' })
  }),

  http.post(`${BASE_URL}/auth/change-password`, async () => {
    return HttpResponse.json({ success: true, message: 'Password changed' })
  }),

  // Employee handlers
  http.get(`${BASE_URL}/employees`, async () => {
    return HttpResponse.json({
      success: true,
      data: [mockEmployee],
      meta: { pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } },
    })
  }),

  http.get(`${BASE_URL}/employees/me`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.get(`${BASE_URL}/employees/search`, async () => {
    return HttpResponse.json({ success: true, data: [mockEmployee] })
  }),

  http.get(`${BASE_URL}/employees/analytics`, async () => {
    return HttpResponse.json({
      success: true,
      data: { total_employees: 50, active_employees: 45 },
    })
  }),

  http.get(`${BASE_URL}/employees/org-chart`, async () => {
    return HttpResponse.json({ success: true, data: [] })
  }),

  http.get(`${BASE_URL}/employees/by-skill`, async () => {
    return HttpResponse.json({ success: true, data: [mockEmployee] })
  }),

  http.get(`${BASE_URL}/employees/:id`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.post(`${BASE_URL}/employees`, async () => {
    return HttpResponse.json(
      { success: true, data: mockEmployee, message: 'Created' },
      { status: 201 }
    )
  }),

  http.put(`${BASE_URL}/employees/:id`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.delete(`${BASE_URL}/employees/:id`, async () => {
    return HttpResponse.json({ success: true, message: 'Deleted' })
  }),

  http.post(`${BASE_URL}/employees/bulk-update`, async () => {
    return HttpResponse.json({ success: true, data: { updated: 2, failed: [] } })
  }),

  http.post(`${BASE_URL}/employees/:id/transfer`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.post(`${BASE_URL}/employees/:id/promote`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.post(`${BASE_URL}/employees/:id/terminate`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.get(`${BASE_URL}/employees/:id/direct-reports`, async () => {
    return HttpResponse.json({ success: true, data: [] })
  }),

  http.put(`${BASE_URL}/employees/:id/skills`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.put(`${BASE_URL}/employees/:id/leave-balance`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.post(`${BASE_URL}/employees/:id/goals`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee }, { status: 201 })
  }),

  http.put(`${BASE_URL}/employees/:id/goals/:goalId`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.put(`${BASE_URL}/employees/me/contact-info`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.put(`${BASE_URL}/employees/me/emergency-contacts`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  http.put(`${BASE_URL}/employees/me/goals/:goalId/progress`, async () => {
    return HttpResponse.json({ success: true, data: mockEmployee })
  }),

  // Department handlers
  http.get(`${BASE_URL}/departments`, async () => {
    return HttpResponse.json({
      success: true,
      data: [mockDepartment],
      meta: { pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } },
    })
  }),

  http.get(`${BASE_URL}/departments/:id`, async () => {
    return HttpResponse.json({ success: true, data: mockDepartment })
  }),
]

export { mockUser, mockTokens, mockEmployee, mockDepartment }
