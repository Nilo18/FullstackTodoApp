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
  loggingIn: boolean = false
  gotError: boolean = false 
  errMsg: string = ''

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    })
  }

  async onSubmit(credentials: LoginCredentials) {
    this.loggingIn = true;

    try {
      await this.authService.loginUser(credentials)
      this.loggingIn = false;
      // navigate() takes an array for flexibility, this way it can determine which part of the URL is static and which one is dynamic
      this.router.navigate(['/home']) 
    } catch(err: any) {
      this.gotError = true;
      this.loggingIn = false  
      this.errMsg = err.error
    }

  }

  get username() {
  return this.loginForm.get('username')!;
}

get password() {
  return this.loginForm.get('password')!;
}

getUsernameError(): string {
  if (this.username.hasError('required')) {
    return 'Username is required.';
  }
  if (this.username.hasError('minlength')) {
    return 'Username must be at least 3 characters.';
  }
  if (this.username.hasError('maxlength')) {
    return 'Username cannot exceed 20 characters.';
  }
  return '';
}

getPasswordError(): string {
  if (this.password.hasError('required')) {
    return 'Password is required.';
  }
  if (this.password.hasError('minlength')) {
    return 'Password must be at least 5 characters.';
  }
  if (this.password.hasError('maxlength')) {
    return 'Password cannot exceed 100 characters.';
  }
  return '';
}
}
