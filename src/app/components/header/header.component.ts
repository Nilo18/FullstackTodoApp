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
  isLoggingOut: boolean = false;
  gotError: boolean = false;
  errMsg: string = ''

  navigateAndReload() {
      this.router.navigate(['/signup']).then(() => {
        window.location.href = '/signup' // Refresh the page to clear the memory of token leftovers
    });
  }

  async logout() {
    try {
      this.isLoggingOut = true
      await this.authService.logoutUser()
      this.navigateAndReload()
    } catch (err: any) {
      this.isLoggingOut = false;
      this.gotError = true;
      this.errMsg = err.error.message
    }
  }
}
