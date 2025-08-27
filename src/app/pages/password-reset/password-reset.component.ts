import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials, PasswordResetCredentials } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder) {}

  resetForm!: FormGroup
  reqWasSent: boolean = false
  gotError: boolean = false
  errMsg: string = ''

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]]
    })  
  }

  async onSubmit(credentials: PasswordResetCredentials) {
    try {
      this.reqWasSent = true; 
      await this.authService.resetPasswordReq(credentials)
      // this.router.navigate(['/home']) 
    } catch(err: any) {
      this.gotError = true
      this.reqWasSent = false // reset reqWasSent and allow the error to be displayed
      console.log(err.error.message)
      this.errMsg = err.error.message
    }

  }
}
