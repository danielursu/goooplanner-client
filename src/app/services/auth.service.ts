// auth.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { tap } from "rxjs/operators";
import CryptoES from "crypto-es";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private apiUrl = "http://localhost:3000/auth";

	constructor(private http: HttpClient) {}

	private encryptPassword(password: string): string {
		return CryptoES.SHA256(password).toString();
	}

	login(email: string, password: string) {
		const encryptedPassword = this.encryptPassword(password);
		return this.http.post(`${this.apiUrl}/login`, {
			email,
			password: encryptedPassword,
		});
	}
}
