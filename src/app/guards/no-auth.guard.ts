import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
	providedIn: "root",
})
export class NoAuthGuard implements CanActivate {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	public canActivate(): boolean {
		if (this.authService.isLoggedIn()) {
			this.router.navigate([""]);
			return false;
		} else {
			return true;
		}
	}
}
