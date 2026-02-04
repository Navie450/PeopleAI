// Department List Item
export interface DepartmentListItem {
  id: string
  name: string
  code: string
  description?: string
  parent_id?: string
  parent_name?: string
  manager_id?: string
  manager_name?: string
  location?: string
  employee_count?: number
  is_active: boolean
  created_at: string
}

// Department Detail
export interface Department extends DepartmentListItem {
  budget?: number
  children?: DepartmentListItem[]
  metadata?: Record<string, unknown>
  updated_at: string
}

// Create Department DTO
export interface CreateDepartmentDto {
  name: string
  code: string
  description?: string
  parent_id?: string
  manager_id?: string
  location?: string
  budget?: number
  metadata?: Record<string, unknown>
}

// Update Department DTO
export interface UpdateDepartmentDto extends Partial<CreateDepartmentDto> {
  is_active?: boolean
}

// List Departments Query
export interface ListDepartmentsQuery {
  page?: number
  limit?: number
  search?: string
  parent_id?: string
  is_active?: boolean
  include_children?: boolean
}

// Department Hierarchy
export interface DepartmentHierarchy {
  id: string
  name: string
  code: string
  employee_count?: number
  children?: DepartmentHierarchy[]
}

// Department Employees Response
export interface DepartmentEmployeesResponse {
  department: DepartmentListItem
  employees: Array<{
    id: string
    employee_id: string
    full_name: string
    job_title: string
    work_email: string
  }>
}
