import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable, tap } from "rxjs";

import { AuthService } from "../services/auth.service";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	public canActivate(): Observable<boolean> {
		return this.authService.getNewAccessToken().pipe(
			tap((isValid) => {
				if (this.authService.isLoggedIn() && this.authService.isRefreshTokenExpired()) {
					console.log("access_token refreshed:", isValid);
				} else {
					console.log("Log out, refresh_token expired.");
					this.authService.logout();
					this.router.navigate(["/login"]);
				}
			}),
		);
	}
}
