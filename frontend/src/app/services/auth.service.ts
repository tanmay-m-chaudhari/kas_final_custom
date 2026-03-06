import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'ed_token';
  private usernameKey = 'ed_username';
  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setAuth(token: string, username: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.usernameKey, username);
    this.isLoggedIn$.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.isLoggedIn$.next(false);
  }

  getUsername(): string {
    return localStorage.getItem(this.usernameKey) ?? '';
  }
}
