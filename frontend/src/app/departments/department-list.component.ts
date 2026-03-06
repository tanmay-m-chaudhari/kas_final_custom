import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Department } from '../models/employee.model';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:800px;margin:0 auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <h1 style="font-size:1.5rem;font-weight:700;color:#1f2937;">Departments</h1>
        <button *ngIf="auth.isLoggedIn$ | async" (click)="showForm = !showForm"
          style="background:#4f46e5;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:0.9rem;">
          + New Department
        </button>
      </div>

      <div *ngIf="showForm && (auth.isLoggedIn$ | async)"
        style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;padding:1.5rem;margin-bottom:1.5rem;">
        <h2 style="font-size:1rem;font-weight:600;margin-bottom:1rem;">Add Department</h2>
        <input [(ngModel)]="newName" placeholder="Department name *"
          style="width:100%;border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;margin-bottom:10px;" />
        <input [(ngModel)]="newDesc" placeholder="Description (optional)"
          style="width:100%;border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;margin-bottom:14px;" />
        <p *ngIf="formError" style="color:#ef4444;font-size:0.85rem;margin-bottom:10px;">{{ formError }}</p>
        <div style="display:flex;gap:10px;">
          <button (click)="createDepartment()"
            style="background:#4f46e5;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:0.9rem;">Create</button>
          <button (click)="showForm = false"
            style="border:1px solid #e5e7eb;background:#fff;padding:8px 20px;border-radius:8px;font-size:0.9rem;">Cancel</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div *ngFor="let d of departments"
          style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;padding:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <h3 style="font-size:1rem;font-weight:700;color:#1f2937;">{{ d.name }}</h3>
              <p style="font-size:0.85rem;color:#6b7280;margin-top:4px;">{{ d.description || 'No description' }}</p>
            </div>
            <button *ngIf="auth.isLoggedIn$ | async" (click)="deleteDepartment(d.id)"
              style="font-size:0.8rem;color:#ef4444;border:none;background:none;">Delete</button>
          </div>
          <div style="margin-top:12px;display:flex;align-items:center;gap:6px;">
            <span style="background:#ede9fe;color:#6d28d9;padding:4px 12px;border-radius:20px;font-size:0.82rem;font-weight:600;">
              {{ d.employee_count }} employee{{ d.employee_count === 1 ? '' : 's' }}
            </span>
          </div>
        </div>
        <div *ngIf="departments.length === 0"
          style="grid-column:span 2;text-align:center;padding:3rem;color:#9ca3af;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
          No departments found.
        </div>
      </div>
    </div>
  `,
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  showForm = false;
  newName = '';
  newDesc = '';
  formError = '';

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.api.getDepartments().subscribe((d) => { this.departments = d; });
  }

  createDepartment() {
    if (!this.newName.trim()) { this.formError = 'Name is required.'; return; }
    this.api.createDepartment({ name: this.newName.trim(), description: this.newDesc || undefined }).subscribe({
      next: () => { this.showForm = false; this.newName = ''; this.newDesc = ''; this.loadDepartments(); },
      error: (e) => { this.formError = e.error?.error ?? 'Failed to create department.'; },
    });
  }

  deleteDepartment(id: number) {
    this.api.deleteDepartment(id).subscribe(() => this.loadDepartments());
  }
}
