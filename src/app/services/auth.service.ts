import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";
import CryptoES from "crypto-es";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";

interface Tokens {
	access_token: string;
	refresh_token: string;
}

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

	public login(email: string, password: string): Observable<Tokens> {
		const encryptedPassword = this.encryptPassword(password);

		return this.http
			.post<Tokens>(
				`${this.apiUrl}/login`,
				{
					email,
					password: encryptedPassword,
				},
				{
					withCredentials: true,
				},
			)
			.pipe(
				tap((response: Tokens) => {
					console.log("Tokens:", response);
					if (response) {
						localStorage.setItem("access_token", response.access_token);
						localStorage.setItem("refresh_token", response.refresh_token);
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
		localStorage.removeItem("refresh_token");
		this.router.navigate(["/login"]);
	}

	public isLoggedIn(): boolean {
		const token = localStorage.getItem("access_token");
		return !!token;
	}

	public isRefreshTokenExpired(): boolean {
		const token = localStorage.getItem("refresh_token");

		if (!token) {
			return true;
		}

		try {
			const decodedToken: { exp: number } = jwtDecode(token);
			const tokenExpire = decodedToken.exp;

			const currentTime = Math.floor(Date.now() / 1000);

			// verify access token expiration
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

	private isAccessTokenExpired(): boolean {
		const token = localStorage.getItem("access_token");

		if (!token) {
			return true;
		}

		try {
			const decodedToken: { exp: number } = jwtDecode(token);
			const tokenExpire = decodedToken.exp;

			const currentTime = Math.floor(Date.now() / 1000);

			if (currentTime > tokenExpire) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error("Error decoding token", error);
			return false;
		}
	}

	public getAccessToken(): string | null {
		return localStorage.getItem("access_token");
	}

	public getNewAccessToken(): Observable<boolean> {
		if (this.isAccessTokenExpired()) {
			console.log("yes, access_token is expired");

			return this.http
				.post<Tokens>(`${this.apiUrl}/refresh`, {
					refresh_token: localStorage.getItem("refresh_token"),
				})
				.pipe(
					map((response) => {
						console.log("new access token:", response);
						if (response && response.access_token) {
							localStorage.setItem("access_token", response.access_token);
							return true;
						}
						return false;
					}),
					catchError((error) => {
						console.error("Error occurred:", error);
						return of(false);
					}),
				);
		} else {
			console.log("no, access_token is not expired");
			return of(true);
		}
	}

	getRefreshTokenCookie(): Observable<string> {
		return this.http.get(`${this.apiUrl}/get-cookie`, { responseType: "text", withCredentials: true });
	}
}
