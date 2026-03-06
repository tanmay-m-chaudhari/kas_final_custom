import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee, EmployeeListResponse, Department } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEmployees(params: {
    search?: string;
    department_id?: number;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Observable<EmployeeListResponse> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.department_id) httpParams = httpParams.set('department_id', String(params.department_id));
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.page) httpParams = httpParams.set('page', String(params.page));
    if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
    return this.http.get<EmployeeListResponse>(`${this.base}/employees`, { params: httpParams });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.base}/employees/${id}`);
  }

  createEmployee(data: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${this.base}/employees`, data);
  }

  updateEmployee(id: number, data: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.base}/employees/${id}`, data);
  }

  deleteEmployee(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/employees/${id}`);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.base}/departments`);
  }

  createDepartment(data: { name: string; description?: string }): Observable<Department> {
    return this.http.post<Department>(`${this.base}/departments`, data);
  }

  deleteDepartment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/departments/${id}`);
  }

  login(username: string, password: string): Observable<{ token: string; username: string }> {
    return this.http.post<{ token: string; username: string }>(`${this.base}/auth/login`, { username, password });
  }
}
