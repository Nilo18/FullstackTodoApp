import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, SignUpCredentials } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  form!: FormGroup
  signingUp: boolean = false

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      // The first parameter is the initial value of the field, and the second is the list (array) of validators
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    })

    console.log(this.authService.hasToken())
  }

  async onSubmit(credentials: SignUpCredentials) {
    this.signingUp = true;
    console.log('Loading...')
    console.log(this.form.value) // FormBuilder's .value property is the finalized version of all of it's fields
    await this.authService.signUpUser(credentials)
    this.router.navigate(['/home'])
  }

  // Getters for easy template access
  get username() {
    return this.form.get('username')!;
  }

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  // Error messages
  get usernameError(): string {
    if (this.username.hasError('required')) return 'Username is required.';
    if (this.username.hasError('minlength')) return 'Username must be at least 3 characters.';
    if (this.username.hasError('maxlength')) return 'Username cannot exceed 20 characters.';
    return '';
  }

  get emailError(): string {
    if (this.email.hasError('required')) return 'Email is required.';
    if (this.email.hasError('minlength')) return 'Email must be at least 3 characters.';
    if (this.email.hasError('maxlength')) return 'Email cannot exceed 100 characters.';
    if (this.email.hasError('email')) return 'Please enter a valid email.';
    return '';
  }

  get passwordError(): string {
    if (this.password.hasError('required')) return 'Password is required.';
    if (this.password.hasError('minlength')) return 'Password must be at least 5 characters.';
    if (this.password.hasError('maxlength')) return 'Password cannot exceed 100 characters.';
    return '';
  }

}
