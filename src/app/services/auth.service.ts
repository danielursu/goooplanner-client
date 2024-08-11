import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import CryptoES from "crypto-es";
import { Observable, throwError } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private apiUrl = "http://localhost:3000/auth";

	constructor(private http: HttpClient) {}

	private encryptPassword(password: string): string {
		return CryptoES.SHA256(password).toString();
	}

	login(email: string, password: string): Observable<any> {
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

	logout(): void {
		localStorage.removeItem("access_token");
	}

	isLoggedIn(): boolean {
		const token = localStorage.getItem("access_token");
		return !!token;
	}

	getToken(): string | null {
		return localStorage.getItem("access_token");
	}
}
