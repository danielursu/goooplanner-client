import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import CryptoES from "crypto-es";
import { Router } from "@angular/router";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-register",
	standalone: true,
	imports: [RouterModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss",
})
export class RegisterComponent {
	private readonly fb = inject(FormBuilder);
	private readonly router = inject(Router);
	private readonly http = inject(HttpClient);

	constructor() {
		this.registerForm = this.fb.group(
			{
				email: ["", [Validators.required, Validators.email]],
				password: ["", [Validators.required, Validators.minLength(6)]],
				confirmPassword: ["", [Validators.required]],
				firstName: ["", [Validators.required]],
				lastName: ["", [Validators.required]],
			},
			{ validators: this.passwordMatchValidator },
		);
	}

	public registerForm: FormGroup;
	public showPassword = false;
	public showConfirmPassword = false;

	public togglePasswordVisibility(field: "password" | "confirmPassword"): void {
		if (field === "password") {
			this.showPassword = !this.showPassword;
		} else {
			this.showConfirmPassword = !this.showConfirmPassword;
		}
	}

	private encryptPassword(password: string): string {
		return CryptoES.SHA256(password).toString();
	}

	private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
		const password = control.get("password");
		const confirmPassword = control.get("confirmPassword");

		if (password && confirmPassword && password.value !== confirmPassword.value) {
			return { passwordMismatch: true };
		}

		return null;
	}

	private register(): void {
		const formValue = this.registerForm.value;

		const encryptedPassword = this.encryptPassword(formValue.password);

		const submissionData = {
			...formValue,
			password: encryptedPassword,
			confirmPassword: encryptedPassword,
		};

		console.log("Registration submitted", submissionData);

		this.http.post("http://localhost:3000/auth/register", submissionData).subscribe({
			next: (response) => {
				console.log("Response from server", response);
				this.router.navigate(["/"]);
			},
			error: (error) => {
				console.error("Error submitting form", error);
			},
		});
	}

	public onSubmit(): void {
		if (this.registerForm.valid) {
			console.log("Login submitted: ", this.registerForm.value);
			this.register();
		}
	}
}
