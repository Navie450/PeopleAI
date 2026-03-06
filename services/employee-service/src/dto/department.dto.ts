import { z } from 'zod';

// Create Department Schema
export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
  code: z.string().min(1, 'Department code is required').max(20),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional(),
  manager_id: z.string().uuid().optional(),
  location: z.string().optional(),
  budget: z.number().min(0).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;

// Update Department Schema
export const updateDepartmentSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().min(1).max(20).optional(),
  description: z.string().nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  manager_id: z.string().uuid().nullable().optional(),
  location: z.string().nullable().optional(),
  budget: z.number().min(0).nullable().optional(),
  is_active: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>;

// List Departments Query Schema
export const listDepartmentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  parent_id: z.string().uuid().optional(),
  is_active: z.coerce.boolean().optional(),
  include_children: z.coerce.boolean().default(false),
});

export type ListDepartmentsQuery = z.infer<typeof listDepartmentsQuerySchema>;

// Response Interfaces
export interface DepartmentListItemResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  parent_id?: string;
  parent_name?: string;
  manager_id?: string;
  manager_name?: string;
  location?: string;
  employee_count?: number;
  is_active: boolean;
  created_at: Date;
}

export interface DepartmentDetailResponse extends DepartmentListItemResponse {
  budget?: number;
  children?: DepartmentListItemResponse[];
  metadata?: Record<string, unknown>;
  updated_at: Date;
}

export interface DepartmentHierarchy {
  id: string;
  name: string;
  code: string;
  children?: DepartmentHierarchy[];
}
