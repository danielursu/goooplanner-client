import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { CommonModule } from "@angular/common";
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
	imports: [CommonModule, RouterModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
	private readonly fb = inject(FormBuilder);
	private readonly router = inject(Router);
	private readonly http = inject(HttpClient);

	public registerForm: FormGroup;
	public showPassword = false;
	public showConfirmPassword = false;
	public isLoading = false;

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

	public togglePasswordVisibility(field: "password" | "confirmPassword"): void {
		if (field === "password") {
			this.showPassword = !this.showPassword;
		} else {
			this.showConfirmPassword = !this.showConfirmPassword;
		}
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
		this.isLoading = true;
		const formValue = this.registerForm.value;

		const submissionData = {
			email: formValue.email,
			password: formValue.password,
			firstName: formValue.firstName,
			lastName: formValue.lastName,
		};

		this.http.post("http://localhost:3000/auth/register", submissionData).subscribe({
			next: (response) => {
				console.log("Registration successful");
				this.isLoading = false;
				this.router.navigate(["/login"]);
			},
			error: (error) => {
				console.error("Registration failed", error);
				this.isLoading = false;
				
				if (error.status === 409) {
					// Email already exists
					this.registerForm.get('email')?.setErrors({ emailTaken: true });
				} else {
					// Handle other errors
					this.registerForm.setErrors({ serverError: true });
				}
			},
		});
	}

	public getErrorMessage(controlName: string): string | null {
		const control = this.registerForm.get(controlName);
		if (control?.errors && (control.touched || control.dirty)) {
			if (control.errors['required']) {
				return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
			}
			if (control.errors['email']) {
				return 'Please enter a valid email address';
			}
			if (control.errors['minlength']) {
				return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
			}
			if (control.errors['emailTaken']) {
				return 'This email is already registered';
			}
		}
		return null;
	}

	public getFormError(): string | null {
		if (this.registerForm.errors?.['serverError']) {
			return 'An unexpected error occurred. Please try again later.';
		}
		if (this.registerForm.errors?.['passwordMismatch']) {
			return 'Passwords do not match';
		}
		return null;
	}

	public onSubmit(): void {
		if (this.registerForm.valid) {
			this.register();
		}
	}
}
