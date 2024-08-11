import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

@Injectable({
	providedIn: "root",
})
export class JwtService {
	getDecodedToken(): any {
		const token = localStorage.getItem("access_token");
		return token ? jwtDecode(token) : null;
	}

	getUserData(): any {
		const decodedToken = this.getDecodedToken();
		if (decodedToken) {
			return {
				userId: decodedToken.sub,
				firstName: decodedToken.firstName,
				lastName: decodedToken.lastName,
				email: decodedToken.email,
			};
		}
		return null;
	}
}
