import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  {
    path: 'employees',
    loadComponent: () => import('./employees/employee-list.component').then(m => m.EmployeeListComponent),
  },
  {
    path: 'departments',
    loadComponent: () => import('./departments/department-list.component').then(m => m.DepartmentListComponent),
  },
  { path: '**', redirectTo: 'employees' },
];
