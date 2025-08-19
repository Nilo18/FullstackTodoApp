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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      // The first parameter is the initial value of the field, and the second is the list (array) of validators
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    })
  }

  async onSubmit(credentials: SignUpCredentials) {
    console.log('Loading...')
    console.log(this.form.value) // FormBuilder's .value property is the finalized version of all of it's fields
    await this.authService.signUpUser(credentials)
    this.router.navigate(['/'])
  }
}
