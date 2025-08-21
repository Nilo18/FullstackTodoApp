import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router: Router = inject(Router)
  const authService = inject(AuthService)

  if (authService.hasToken()) {
    return true
  } else {
    router.navigate(['/signup'])
    return false
  }
};
