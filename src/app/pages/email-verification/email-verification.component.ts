import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent {
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}
  gotError: boolean = false
  isVerifying: boolean = true;
  errMsg: string = ''

  async ngOnInit() {
    // Get token from the route parameters
    try {
      const verToken = this.route.snapshot.paramMap.get('token')
      if (!verToken) {
        return // Exit if the URL doesn't contain the verification token
      }

      const accessToken = await this.authService.verifyEmail(verToken)
      if (!accessToken) {
        console.log('Permission denied.')
        return
      } 
      this.router.navigate(['/home'])
    } catch(err: any) {
      this.isVerifying = false
      this.gotError = true
      this.errMsg = err.error.message
    }
  }

}
