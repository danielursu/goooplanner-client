import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";
import CryptoES from "crypto-es";
import { jwtDecode } from "jwt-decode";
import { CookieService } from "ngx-cookie-service";

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
		private cookie: CookieService,
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
						// did not add refresh_token in the localstorage
					}
				}),
				catchError((error) => {
					console.error("Error occurred:", error);
					return throwError(error);
				}),
			);
	}

	public logout(): Observable<{ message: string }> {
		localStorage.removeItem("access_token");
		// remove the refresh_token from cookies
		return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
	}

	public isLoggedIn(): boolean {
		const token = localStorage.getItem("access_token");
		return !!token;
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

	// need to get the refresh_token form cookies
	public isRefreshTokenExpired(): boolean {
		const token = this.cookie.get("refresh_token");
		console.log(token);

		if (!token) {
			return false;
		}
		return true;
	}

	// need to get the refresh_token from cookies
	public getNewAccessToken(): Observable<boolean> {
		const refreshToken = this.cookie.get("refresh_token");

		if (this.isAccessTokenExpired()) {
			console.log("yes, access_token is expired");
			return this.http
				.post<Tokens>(`${this.apiUrl}/refresh`, {
					refresh_token: refreshToken,
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

	// I use cookie service to get the refresh_token from cookies
	public getRefreshTokenCookie(): Observable<string> {
		return this.http.get(`${this.apiUrl}/get-cookie`, { responseType: "text", withCredentials: true });
	}
}
