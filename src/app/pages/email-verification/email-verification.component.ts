import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent {
  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  async ngOnInit() {
    // Get token from the route parameters
    
    const token = this.route.snapshot.paramMap.get('token')
    if (token) {
      await this.authService.verifyEmail(token)
    } else {
      console.log('No token found in the URL')
    }
  }
}
