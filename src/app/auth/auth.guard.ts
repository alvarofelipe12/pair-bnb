import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.userIsAuthenticated) {
    router.navigateByUrl('/auth');
  }
  return authService.userIsAuthenticated;
};
