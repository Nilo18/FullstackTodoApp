import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder) {}

  resetForm!: FormGroup

  ngOnInit() {
    this.resetForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    })  
  }

  async onSubmit(credentials: LoginCredentials) {
    console.log(credentials)
    console.log(this.resetForm.value)
    await this.authService.resetPassword(credentials)
    this.router.navigate(['/home']) 
  }
}
