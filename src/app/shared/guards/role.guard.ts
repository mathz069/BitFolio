import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
   const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.obterToken();
  if (!token) {
    return router.parseUrl('/login'); // <- retorne UrlTree
  }

  try {
    const payload: any = jwtDecode(token);
    const role = payload?.role || payload?.Role || null;
    const userRole = role ? role.toLowerCase() : null;
    const rolesPermitidas = route.data['roles'] as string[];

    if (rolesPermitidas.includes(userRole)) {
      return true;
    }

    return router.parseUrl('/login'); 

  } catch (err) {
    return router.parseUrl('/login');
  }
};