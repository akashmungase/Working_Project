import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.escuelajs.co/api/v1';
  private currentUserSubject = new BehaviorSubject<any>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    if (token) {
      setTimeout(() => this.fetchUserProfile(), 0);
    }
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        this.fetchUserProfile();
      })
    );
  }

  fetchUserProfile() {
    this.http.get<User>(`${this.apiUrl}/auth/profile`).subscribe({
      next: (user) => {
        localStorage.setItem('user_data', JSON.stringify(user));
        this.currentUserSubject.next(user);
      },
      error: () => this.logout()
    });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('cart');
    this.currentUserSubject.next(null);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, user);
  }
}