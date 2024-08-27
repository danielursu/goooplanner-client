import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { UserData, DecodedToken } from "../types/jwt.types";

@Injectable({
	providedIn: "root",
})
export class JwtService {
	public getDecodedToken(): DecodedToken | null {
		const token = localStorage.getItem("access_token");
		return token ? jwtDecode<DecodedToken>(token) : null;
	}

	public getUserData(): UserData | null {
		const decodedToken = this.getDecodedToken();
		if (decodedToken) {
			return {
				userId: decodedToken.id,
				firstName: decodedToken.firstName,
				lastName: decodedToken.lastName,
				email: decodedToken.email,
			};
		}
		return null;
	}
}
