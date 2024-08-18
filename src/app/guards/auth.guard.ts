import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

import { AuthService } from "../services/auth.service";
import { Observable, tap } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	canActivate(): Observable<boolean> {
		return this.authService.getNewAccessToken().pipe(
			tap((isValid) => {
				if (this.authService.isLoggedIn() && this.authService.isRefreshTokenExpired()) {
					console.log("Access token refreshed:", isValid);
				} else {
					this.authService.logout();
				}
			}),
		);
	}
}
