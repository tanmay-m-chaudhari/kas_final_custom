export type EmployeeStatus = 'active' | 'inactive' | 'on_leave';

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  department_id?: number;
  department_name?: string;
  hire_date?: string;
  status: EmployeeStatus;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeListResponse {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  employee_count: number;
  created_at: string;
}
