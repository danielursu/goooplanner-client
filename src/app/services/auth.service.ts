import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserData } from '../types/jwt.types';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

interface AuthUser {
  token: string;
  refreshToken: string;
  refreshTokenExpiration: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  private userSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<AuthUser | null>;
  public user$: Observable<UserData | null>;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(initialUser);
    this.userSubject = new BehaviorSubject<UserData | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.user$ = this.userSubject.asObservable();

    if (initialUser?.token) {
      this.updateUserData(initialUser.token);
    }
    
    console.log('AuthService initialized', { 
      hasUser: !!initialUser,
      tokenValid: initialUser?.token && !this.jwtHelper.isTokenExpired(initialUser.token),
      refreshTokenValid: initialUser?.refreshToken && !this.isRefreshTokenExpired()
    });
  }

  private updateUserData(token: string): void {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.userSubject.next(decodedToken);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.userSubject.next(null);
    }
  }

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    const user = this.currentUserValue;
    return user?.token || null;
  }

  isAccessTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    return this.jwtHelper.isTokenExpired(token);
  }

  isRefreshTokenExpired(): boolean {
    const user = this.currentUserValue;
    if (!user?.refreshToken || !user?.refreshTokenExpiration) {
      return true;
    }
    return Date.now() >= user.refreshTokenExpiration;
  }

  getNewAccessToken(): Observable<string> {
    console.log('Refreshing access token');
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/refresh-token`,
      { refreshToken: this.currentUserValue?.refreshToken }
    ).pipe(
      map(response => {
        const user: AuthUser = { 
          token: response.access_token,
          refreshToken: response.refresh_token,
          refreshTokenExpiration: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.updateUserData(user.token);
        console.log('Access token refreshed');
        return response.access_token;
      })
    );
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(response => {
          const user: AuthUser = {
            token: response.access_token,
            refreshToken: response.refresh_token,
            refreshTokenExpiration: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.updateUserData(user.token);
          return user;
        })
      );
  }

  logout(): void {
    // Call logout endpoint to clear refresh token cookie
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
      next: () => console.log('Logout successful'),
      error: (error) => console.error('Logout failed:', error)
    });

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.userSubject.next(null);
    console.log('User logged out');
  }

  isLoggedIn(): boolean {
    const isLoggedIn = !!this.currentUserValue?.token;
    console.log('isLoggedIn:', isLoggedIn, this.currentUserValue);
    return isLoggedIn;
  }
}
