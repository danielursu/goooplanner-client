import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import CryptoES from "crypto-es";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private apiUrl = "http://localhost:3000/auth";

	constructor(
		private http: HttpClient,
		private router: Router,
	) {}

	private encryptPassword(password: string): string {
		return CryptoES.SHA256(password).toString();
	}

	public login(email: string, password: string): Observable<string> {
		const encryptedPassword = this.encryptPassword(password);

		return this.http
			.post(
				`${this.apiUrl}/login`,
				{
					email,
					password: encryptedPassword,
				},
				{ responseType: "text" },
			)
			.pipe(
				tap((response) => {
					console.log("Response as text:", response);
					if (response) {
						localStorage.setItem("access_token", response);
					}
				}),
				catchError((error) => {
					console.error("Error occurred:", error);
					return throwError(error);
				}),
			);
	}

	public logout(): void {
		localStorage.removeItem("access_token");
		this.router.navigate(["/login"]);
	}

	public isLoggedIn(): boolean {
		const token = localStorage.getItem("access_token");
		return !!token;
	}

	public isNotExpired(): boolean {
		const token = localStorage.getItem("access_token");

		if (!token) {
			return true;
		}

		try {
			const decodedToken: { exp: number } = jwtDecode(token);
			const tokenExpire = decodedToken.exp;

			const currentTime = Math.floor(Date.now() / 1000);

			if (currentTime > tokenExpire) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			console.error("Error decoding token", error);
			return false;
		}
	}

	public getToken(): string | null {
		return localStorage.getItem("access_token");
	}
}
