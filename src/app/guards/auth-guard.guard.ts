import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router: Router = inject(Router)
  const storedToken = localStorage.getItem('accessToken')
  const accessToken = storedToken ? JSON.parse(storedToken) : null

  if (accessToken) {
    return true
  } else {
    router.navigate(['/signup'])
    return false
  }
};
