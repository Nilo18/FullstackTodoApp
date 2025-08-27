import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-verification',
  templateUrl: './password-reset-verification.component.html',
  styleUrl: './password-reset-verification.component.scss'
})
export class PasswordResetVerificationComponent {
  newPassword!: FormGroup
  gotError: boolean = false;
  isSendingReq: boolean = false;
  errMsg: string = ''

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.newPassword = this.fb.group({
      password: ['', [Validators.required, Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
    })
  }
  
    get password() {
      return this.newPassword.get('password')!
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

  async onSubmit(newPass: string) {
    this.isSendingReq = true;
    try {
      console.log(newPass)
      const resetToken = this.route.snapshot.paramMap.get('token')
      this.isSendingReq = false
      await this.authService.resetPassword(newPass, resetToken)
      this.router.navigate(['/home'])
    } catch(err: any) {
      this.gotError = true;
      this.isSendingReq = false
      this.errMsg = err.error.message
    }
  }
}
