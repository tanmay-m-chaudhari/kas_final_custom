import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  template: `
    <nav style="background:#4f46e5;color:#fff;padding:0 2rem;display:flex;align-items:center;gap:2rem;height:56px;">
      <span style="font-weight:700;font-size:1.1rem;">Employee Directory</span>
      <a routerLink="/employees" routerLinkActive="active-nav"
         style="font-size:0.9rem;opacity:0.85;padding:6px 12px;border-radius:6px;">Employees</a>
      <a routerLink="/departments" routerLinkActive="active-nav"
         style="font-size:0.9rem;opacity:0.85;padding:6px 12px;border-radius:6px;">Departments</a>
      <div style="margin-left:auto;display:flex;align-items:center;gap:1rem;">
        <ng-container *ngIf="auth.isLoggedIn$ | async; else loginBlock">
          <span style="font-size:0.85rem;opacity:0.8;">{{ auth.getUsername() }}</span>
          <button (click)="auth.logout()"
            style="background:rgba(255,255,255,0.15);border:none;color:#fff;padding:6px 14px;border-radius:6px;font-size:0.85rem;">
            Logout
          </button>
        </ng-container>
        <ng-template #loginBlock>
          <button (click)="showLogin = !showLogin"
            style="background:rgba(255,255,255,0.15);border:none;color:#fff;padding:6px 14px;border-radius:6px;font-size:0.85rem;">
            Admin Login
          </button>
        </ng-template>
      </div>
    </nav>

    <div *ngIf="showLogin && !(auth.isLoggedIn$ | async)"
      style="position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:50;">
      <div style="background:#fff;border-radius:12px;padding:2rem;width:320px;">
        <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:1rem;">Admin Login</h2>
        <input [(ngModel)]="loginUser" placeholder="Username"
          style="width:100%;border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;margin-bottom:10px;" />
        <input type="password" [(ngModel)]="loginPass" placeholder="Password"
          style="width:100%;border:1px solid #e5e7eb;border-radius:8px;padding:8px 12px;font-size:0.9rem;margin-bottom:14px;" />
        <p *ngIf="loginError" style="color:#ef4444;font-size:0.82rem;margin-bottom:10px;">{{ loginError }}</p>
        <div style="display:flex;gap:10px;">
          <button (click)="doLogin()"
            style="flex:1;background:#4f46e5;color:#fff;border:none;border-radius:8px;padding:8px;font-size:0.9rem;">Login</button>
          <button (click)="showLogin = false"
            style="flex:1;border:1px solid #e5e7eb;border-radius:8px;padding:8px;font-size:0.9rem;background:#fff;">Cancel</button>
        </div>
      </div>
    </div>

    <main style="padding:2rem;">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  showLogin = false;
  loginUser = '';
  loginPass = '';
  loginError = '';

  constructor(public auth: AuthService, private api: ApiService) {}

  doLogin() {
    this.api.login(this.loginUser, this.loginPass).subscribe({
      next: (res) => {
        this.auth.setAuth(res.token, res.username);
        this.showLogin = false;
        this.loginError = '';
      },
      error: () => { this.loginError = 'Invalid credentials'; },
    });
  }
}
