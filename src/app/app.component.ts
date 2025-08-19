import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FullstackTodoApp-Front';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    // Always check if new access token is required
    await this.authService.refreshAccessToken() 
  }
}
