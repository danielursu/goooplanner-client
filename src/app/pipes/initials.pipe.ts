import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "initials",
	standalone: true,
})
export class InitialsPipe implements PipeTransform {
	transform(userData: { firstName: string; lastName: string } | null | undefined): string {
		if (!userData || !userData.firstName || !userData.lastName) {
			return "";
		}

		const firstNameInitial = userData.firstName.charAt(0).toUpperCase();
		const lastNameInitial = userData.lastName.charAt(0).toUpperCase();

		return `${firstNameInitial}${lastNameInitial}`;
	}
}
