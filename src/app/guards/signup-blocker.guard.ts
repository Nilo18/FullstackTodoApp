import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const signupBlockerGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router)

  const storedToken = localStorage.getItem('accessToken')
  const accessToken = storedToken ? JSON.parse(storedToken) : null

  // Redirect and block the access to authorization if the user already has a token
  if (accessToken) {
    router.navigate(['/home'])
    return false
  } else {
    return true;
  }
    

};
