import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from "src/app/services/auth.service";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [CommonModule, RouterModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
	private readonly fb = inject(FormBuilder);
	private readonly router = inject(Router);
	private readonly authService = inject(AuthService);
	private readonly cdr = inject(ChangeDetectorRef);

	public loginForm: FormGroup;
	public errorMessage: string | null = null;
	public showPassword = false;
	public isLoading = false;

	constructor() {
		this.loginForm = this.fb.group({
			email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
			password: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(6)]],
		});
	}

	public togglePasswordVisibility(): void {
		this.showPassword = !this.showPassword;
		this.cdr.markForCheck();
	}

	public login(): void {
		if (this.loginForm.invalid) {
			this.errorMessage = "Please fill in all required fields correctly.";
			this.cdr.markForCheck();
			return;
		}

		const email = this.loginForm.get('email')?.value.trim();
		const password = this.loginForm.get('password')?.value.trim();

		this.isLoading = true;
		this.errorMessage = null;
		this.loginForm.disable();
		this.cdr.markForCheck();

		this.authService.login(email, password).pipe(
			catchError(error => {
				console.error("Login error:", error);
				if (error.status === 401) {
					this.errorMessage = "Incorrect email or password.";
				} else {
					this.errorMessage = "An unexpected error occurred. Please try again later.";
				}
				return of(null); // Return an observable that completes
			}),
			finalize(() => {
				this.isLoading = false;
				this.loginForm.enable();
				this.cdr.markForCheck();
			})
		).subscribe(response => {
			if (response) {
				console.log("Login successful");
				this.router.navigate(["/"]);
			}
		});
	}

	public onSubmit(): void {
		if (this.loginForm.valid) {
			console.log("Login submitted:", this.loginForm.value);
			this.login();
		} else {
			this.markFormGroupTouched(this.loginForm);
			this.cdr.markForCheck();
		}
	}

	private markFormGroupTouched(formGroup: FormGroup) {
		Object.values(formGroup.controls).forEach(control => {
			control.markAsTouched();
			if (control instanceof FormGroup) {
				this.markFormGroupTouched(control);
			}
		});
	}

	public getErrorMessage(controlName: string): string {
		const control = this.loginForm.get(controlName);
		if (control?.errors && control.touched) {
			if (control.errors['required']) {
				return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
			}
			if (control.errors['email']) {
				return 'Please enter a valid email address';
			}
			if (control.errors['minlength']) {
				return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
			}
		}
		return '';
	}
}
