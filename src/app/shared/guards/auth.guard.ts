import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router,  } from '@angular/router';
import { AuthService } from 'src/app/login/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.obterToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};