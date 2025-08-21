import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    console.log('Logging out...')
    await this.authService.logoutUser()
    this.router.navigate(['/signup'])
  }
}
