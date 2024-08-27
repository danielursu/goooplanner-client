export interface UserData {
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
}
export interface DecodedToken {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	iat: number;
	exp: number;
}