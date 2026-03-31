import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  const expectedRoles = route.data['roles'] as string[];

  if (!expectedRoles.includes(user.role)) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
