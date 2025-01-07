import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { AuthService } from "../services/auth.service";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	public canActivate(): Observable<boolean> {
		console.log('AuthGuard: checking authentication');
		
		if (!this.authService.isLoggedIn()) {
			console.log('AuthGuard: not logged in, redirecting to login');
			this.router.navigate(["/login"]);
			return of(false);
		}

		// Don't check refresh token on every request
		// Only try to refresh if access token is expired
		if (this.authService.isAccessTokenExpired()) {
			console.log('AuthGuard: access token expired, attempting refresh');
			
			if (this.authService.isRefreshTokenExpired()) {
				console.log('AuthGuard: refresh token expired, logging out');
				this.authService.logout();
				this.router.navigate(["/login"]);
				return of(false);
			}

			return this.authService.getNewAccessToken().pipe(
				map(() => {
					console.log('AuthGuard: access token refreshed, allowing access');
					return true;
				}),
				catchError((error) => {
					console.error('AuthGuard: token refresh failed', error);
					this.authService.logout();
					this.router.navigate(["/login"]);
					return of(false);
				})
			);
		}

		console.log('AuthGuard: token valid, allowing access');
		return of(true);
	}
}
