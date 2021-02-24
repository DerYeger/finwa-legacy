import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated$().pipe(
      map<boolean, boolean | UrlTree>((isAuthenticated) => {
        const path = route.routeConfig?.path;
        if (path === 'setup') {
          return !isAuthenticated || this.router.createUrlTree(['/']);
        }
        return isAuthenticated || this.router.createUrlTree(['/setup']);
      })
    );
  }
}
