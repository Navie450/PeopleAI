/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest'
import { employeesApi } from '@/api/employees.api'

describe('Employees API', () => {
  describe('list', () => {
    it('should fetch employee list', async () => {
      const { data } = await employeesApi.list()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.meta!.pagination!.total).toBe(1)
    })

    it('should pass query params', async () => {
      const { data } = await employeesApi.list({ page: 2, limit: 20 })
      expect(data.success).toBe(true)
    })
  })

  describe('getById', () => {
    it('should fetch employee by ID', async () => {
      const { data } = await employeesApi.getById('emp-uuid-1')
      expect(data.success).toBe(true)
      expect(data.data!.employee_id).toBe('EMP001')
    })
  })

  describe('getMyProfile', () => {
    it('should fetch current user employee profile', async () => {
      const { data } = await employeesApi.getMyProfile()
      expect(data.success).toBe(true)
    })
  })

  describe('create', () => {
    it('should create a new employee', async () => {
      const { data } = await employeesApi.create({
        user_id: 'user-uuid-1',
        first_name: 'John',
        last_name: 'Doe',
        work_email: 'john@company.com',
        job_title: 'Engineer',
        hire_date: '2024-01-15',
      } as any)
      expect(data.success).toBe(true)
    })
  })

  describe('update', () => {
    it('should update an employee', async () => {
      const { data } = await employeesApi.update('emp-uuid-1', { first_name: 'Jane' } as any)
      expect(data.success).toBe(true)
    })
  })

  describe('delete', () => {
    it('should delete an employee', async () => {
      const { data } = await employeesApi.delete('emp-uuid-1')
      expect(data.success).toBe(true)
    })
  })

  describe('bulkUpdate', () => {
    it('should bulk update employees', async () => {
      const { data } = await employeesApi.bulkUpdate({
        employee_ids: ['emp-uuid-1'],
        updates: { is_remote: true },
      } as any)
      expect(data.success).toBe(true)
      expect(data.data!.updated).toBe(2)
    })
  })

  describe('transfer', () => {
    it('should transfer an employee', async () => {
      const { data } = await employeesApi.transfer('emp-uuid-1', {
        new_department_id: 'dept-uuid-2',
        effective_date: '2024-06-01',
      } as any)
      expect(data.success).toBe(true)
    })
  })

  describe('promote', () => {
    it('should promote an employee', async () => {
      const { data } = await employeesApi.promote('emp-uuid-1', {
        new_job_title: 'Senior Engineer',
        effective_date: '2024-06-01',
      } as any)
      expect(data.success).toBe(true)
    })
  })

  describe('terminate', () => {
    it('should terminate an employee', async () => {
      const { data } = await employeesApi.terminate('emp-uuid-1', {
        termination_date: '2024-06-01',
        termination_reason: 'Resignation',
      } as any)
      expect(data.success).toBe(true)
    })
  })

  describe('getDirectReports', () => {
    it('should fetch direct reports', async () => {
      const { data } = await employeesApi.getDirectReports('emp-uuid-1')
      expect(data.success).toBe(true)
    })
  })

  describe('getOrgChart', () => {
    it('should fetch org chart', async () => {
      const { data } = await employeesApi.getOrgChart()
      expect(data.success).toBe(true)
    })
  })

  describe('getAnalytics', () => {
    it('should fetch analytics', async () => {
      const { data } = await employeesApi.getAnalytics()
      expect(data.success).toBe(true)
      expect(data.data!.total_employees).toBe(50)
    })
  })

  describe('search', () => {
    it('should search employees', async () => {
      const { data } = await employeesApi.search('John')
      expect(data.success).toBe(true)
    })
  })

  describe('getBySkill', () => {
    it('should fetch employees by skill', async () => {
      const { data } = await employeesApi.getBySkill('TypeScript', 'advanced')
      expect(data.success).toBe(true)
    })
  })

  describe('updateSkills', () => {
    it('should update employee skills', async () => {
      const { data } = await employeesApi.updateSkills('emp-uuid-1', [
        { name: 'Go', level: 'beginner' },
      ] as any)
      expect(data.success).toBe(true)
    })
  })

  describe('updateLeaveBalance', () => {
    it('should update leave balance', async () => {
      const { data } = await employeesApi.updateLeaveBalance('emp-uuid-1', 'annual', {
        total_days: 25,
      })
      expect(data.success).toBe(true)
    })
  })

  describe('addPerformanceGoal', () => {
    it('should add a performance goal', async () => {
      const { data } = await employeesApi.addPerformanceGoal('emp-uuid-1', {
        title: 'New Goal',
        description: 'Do things',
        target_date: '2024-12-31',
        status: 'not_started',
        progress_percentage: 0,
      })
      expect(data.success).toBe(true)
    })
  })

  describe('updatePerformanceGoal', () => {
    it('should update a performance goal', async () => {
      const { data } = await employeesApi.updatePerformanceGoal('emp-uuid-1', 'goal-1', {
        progress_percentage: 80,
      })
      expect(data.success).toBe(true)
    })
  })
})
