import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [RouterModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss",
})
export class LoginComponent {
	constructor(
		private fb: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private http: HttpClient,
	) {
		this.loginForm = this.fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(6)]],
		});
	}
	loginForm: FormGroup;

	login() {
		const email = this.loginForm.value.email.trim();
		const password = this.loginForm.value.password.trim();

		this.authService.login(email, password).subscribe({
			next: () => {
				console.log("successfull request");
				this.router.navigate(["/"]);
			},
			error: (error) => {
				console.log("Error: ", error);
			},
		});
	}

	onSubmit() {
		if (this.loginForm.valid) {
			console.log("Login submitted: ", this.loginForm.value);
			this.login();
		}
	}
}
