import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    })
  }

  async onSubmit(credentials: LoginCredentials) {
    console.log(this.loginForm.value)
    console.log('Logging in...')
    await this.authService.loginUser(credentials)
    // navigate() takes an array for flexibility, this way it can determine which part of the URL is static and which one is dynamic
    this.router.navigate(['/']) 
  }
}
