import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Employee, Department, EmployeeStatus } from '../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:1100px;margin:0 auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <h1 style="font-size:1.5rem;font-weight:700;color:#1f2937;">Employees</h1>
        <button *ngIf="auth.isLoggedIn$ | async" (click)="openCreateForm()"
          style="background:#4f46e5;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:0.9rem;">
          + Add Employee
        </button>
      </div>

      <div style="display:flex;gap:12px;margin-bottom:1.5rem;flex-wrap:wrap;">
        <input [(ngModel)]="search" (ngModelChange)="onSearchChange()" placeholder="Search name, email, title..."
          style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 14px;font-size:0.9rem;min-width:240px;" />
        <select [(ngModel)]="filterDept" (ngModelChange)="loadEmployees()"
          style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 14px;font-size:0.9rem;">
          <option value="">All Departments</option>
          <option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</option>
        </select>
        <select [(ngModel)]="filterStatus" (ngModelChange)="loadEmployees()"
          style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 14px;font-size:0.9rem;">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on_leave">On Leave</option>
        </select>
      </div>

      <div *ngIf="showForm" style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;padding:1.5rem;margin-bottom:1.5rem;">
        <h2 style="font-size:1rem;font-weight:600;margin-bottom:1rem;">{{ editingId ? 'Edit Employee' : 'New Employee' }}</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <input [(ngModel)]="form.first_name" placeholder="First Name *"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;" />
          <input [(ngModel)]="form.last_name" placeholder="Last Name *"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;" />
          <input [(ngModel)]="form.email" placeholder="Email *"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;" />
          <input [(ngModel)]="form.phone" placeholder="Phone"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;" />
          <input [(ngModel)]="form.job_title" placeholder="Job Title"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;" />
          <select [(ngModel)]="form.department_id"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;">
            <option [ngValue]="null">No Department</option>
            <option *ngFor="let d of departments" [ngValue]="d.id">{{ d.name }}</option>
          </select>
          <input type="date" [(ngModel)]="form.hire_date"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;" />
          <select [(ngModel)]="form.status"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
        <p *ngIf="formError" style="color:#ef4444;font-size:0.85rem;margin-top:10px;">{{ formError }}</p>
        <div style="display:flex;gap:10px;margin-top:14px;">
          <button (click)="submitForm()"
            style="background:#4f46e5;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:0.9rem;">
            {{ editingId ? 'Update' : 'Create' }}
          </button>
          <button (click)="showForm = false"
            style="border:1px solid #e5e7eb;background:#fff;padding:8px 20px;border-radius:8px;font-size:0.9rem;">
            Cancel
          </button>
        </div>
      </div>

      <div style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
          <thead style="background:#f9fafb;">
            <tr>
              <th style="text-align:left;padding:12px 16px;color:#6b7280;font-weight:600;">Name</th>
              <th style="text-align:left;padding:12px 16px;color:#6b7280;font-weight:600;">Title</th>
              <th style="text-align:left;padding:12px 16px;color:#6b7280;font-weight:600;">Department</th>
              <th style="text-align:left;padding:12px 16px;color:#6b7280;font-weight:600;">Status</th>
              <th style="text-align:left;padding:12px 16px;color:#6b7280;font-weight:600;">Hired</th>
              <th *ngIf="auth.isLoggedIn$ | async" style="padding:12px 16px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employees" style="border-top:1px solid #f3f4f6;">
              <td style="padding:12px 16px;">
                <div style="font-weight:600;color:#1f2937;">{{ emp.first_name }} {{ emp.last_name }}</div>
                <div style="font-size:0.8rem;color:#9ca3af;">{{ emp.email }}</div>
              </td>
              <td style="padding:12px 16px;color:#374151;">{{ emp.job_title || '—' }}</td>
              <td style="padding:12px 16px;color:#374151;">{{ emp.department_name || '—' }}</td>
              <td style="padding:12px 16px;">
                <span [style.background]="statusColor(emp.status)"
                  style="padding:3px 10px;border-radius:12px;font-size:0.78rem;font-weight:600;color:#fff;">
                  {{ emp.status }}
                </span>
              </td>
              <td style="padding:12px 16px;color:#6b7280;font-size:0.85rem;">{{ emp.hire_date || '—' }}</td>
              <td *ngIf="auth.isLoggedIn$ | async" style="padding:12px 16px;display:flex;gap:8px;">
                <button (click)="openEditForm(emp)"
                  style="font-size:0.8rem;color:#4f46e5;border:none;background:none;padding:0;">Edit</button>
                <button (click)="deleteEmployee(emp.id)"
                  style="font-size:0.8rem;color:#ef4444;border:none;background:none;padding:0;">Delete</button>
              </td>
            </tr>
            <tr *ngIf="employees.length === 0">
              <td colspan="6" style="text-align:center;padding:3rem;color:#9ca3af;">No employees found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;">
        <span style="font-size:0.85rem;color:#6b7280;">{{ total }} employee(s) total</span>
        <div style="display:flex;gap:8px;">
          <button (click)="prevPage()" [disabled]="page <= 1"
            style="border:1px solid #e5e7eb;background:#fff;padding:6px 14px;border-radius:8px;font-size:0.85rem;">Prev</button>
          <span style="padding:6px 12px;font-size:0.85rem;">Page {{ page }}</span>
          <button (click)="nextPage()" [disabled]="page * limit >= total"
            style="border:1px solid #e5e7eb;background:#fff;padding:6px 14px;border-radius:8px;font-size:0.85rem;">Next</button>
        </div>
      </div>
    </div>
  `,
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  total = 0;
  page = 1;
  limit = 15;
  search = '';
  filterDept = '';
  filterStatus = '';
  showForm = false;
  editingId: number | null = null;
  formError = '';
  searchTimeout: ReturnType<typeof setTimeout> | null = null;

  form: Partial<Employee> & { status: EmployeeStatus } = {
    first_name: '', last_name: '', email: '', phone: '',
    job_title: '', department_id: undefined, hire_date: '', status: 'active',
  };

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getDepartments().subscribe((d) => { this.departments = d; });
    this.loadEmployees();
  }

  loadEmployees() {
    this.api.getEmployees({
      search: this.search || undefined,
      department_id: this.filterDept ? Number(this.filterDept) : undefined,
      status: this.filterStatus || undefined,
      page: this.page,
      limit: this.limit,
    }).subscribe((res) => {
      this.employees = res.data;
      this.total = res.total;
    });
  }

  onSearchChange() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => { this.page = 1; this.loadEmployees(); }, 350);
  }

  openCreateForm() {
    this.editingId = null;
    this.form = { first_name: '', last_name: '', email: '', phone: '', job_title: '', department_id: undefined, hire_date: '', status: 'active' };
    this.formError = '';
    this.showForm = true;
  }

  openEditForm(emp: Employee) {
    this.editingId = emp.id;
    this.form = { ...emp };
    this.formError = '';
    this.showForm = true;
  }

  submitForm() {
    if (!this.form.first_name || !this.form.last_name || !this.form.email) {
      this.formError = 'First name, last name and email are required.';
      return;
    }
    const obs = this.editingId
      ? this.api.updateEmployee(this.editingId, this.form)
      : this.api.createEmployee(this.form);
    obs.subscribe({
      next: () => { this.showForm = false; this.loadEmployees(); },
      error: (e) => { this.formError = e.error?.error ?? 'Failed to save employee.'; },
    });
  }

  deleteEmployee(id: number) {
    this.api.deleteEmployee(id).subscribe(() => this.loadEmployees());
  }

  prevPage() { if (this.page > 1) { this.page--; this.loadEmployees(); } }
  nextPage() { if (this.page * this.limit < this.total) { this.page++; this.loadEmployees(); } }

  statusColor(status: EmployeeStatus): string {
    return status === 'active' ? '#10b981' : status === 'on_leave' ? '#f59e0b' : '#9ca3af';
  }
}
