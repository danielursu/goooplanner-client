import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import * as CryptoJS from 'crypto-js';
import CryptoES from 'crypto-es';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator });
  }

  registerForm: FormGroup;

  private encryptPassword(password: string): string {
    return CryptoES.SHA256(password).toString();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const encryptedPassword = this.encryptPassword(formValue.password);

      const submissionData = {
        ...formValue,
        password: encryptedPassword,
        confirmPassword: encryptedPassword
      };

      console.log('Registration submitted', submissionData);

      this.router.navigate(['/']);
    }
  }
}