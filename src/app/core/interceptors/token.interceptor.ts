// core/interceptors/token.interceptor.ts
import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token to login and refresh-token requests
    if (req.url.includes('auth/login') || req.url.includes('auth/refresh-token')) {
      return next.handle(req);
    }

    // Get AuthService using Injector to avoid circular dependency
    const authService = this.injector.get(AuthService);
    const router = this.injector.get(Router);
    
    const token = authService.getToken();
    
    if (token) {
      const cloned = req.clone({
        setHeaders: { 
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            authService.logout();
            router.navigate(['/login'], {
              queryParams: { returnUrl: router.url }
            });
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }
}