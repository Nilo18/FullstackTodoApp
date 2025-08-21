import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const signupBlockerGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService)
  const router: Router = inject(Router)

  const hasToken = authService.hasToken();
  console.log('signupBlockerGuard: hasToken =', hasToken, 'Current URL:', state.url);

  if (hasToken) {
    console.log('Token found, redirecting to /home');
    return router.createUrlTree(['/home']);
  } else {
    console.log('No token, allowing access to', state.url);
    return true;
  }
    

};
