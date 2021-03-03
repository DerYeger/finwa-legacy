import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, first, map, mergeMap } from 'rxjs/operators';

import { SnackBarService } from 'src/app/services/snack-bar.service';
import { logout } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  public constructor(private readonly store: Store<State>, private readonly snackBarService: SnackBarService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.select('apiToken').pipe(
      map((apiToken) => apiToken?.jwt),
      first(),
      mergeMap((jwt) => {
        if (jwt !== undefined) {
          request = request.clone({
            setHeaders: {
              authorization: `Bearer ${jwt}`,
            },
          });
        }
        return next.handle(request).pipe(
          catchError((error) => {
            if (jwt !== undefined && error.status === 401) {
              this.store.dispatch(logout());
              this.snackBarService.openSnackBar({ key: 'events.login.expired' });
            } else {
              const message = error?.error?.message ?? 'api.error.unknown';
              if (typeof message === 'string') {
                this.snackBarService.openSnackBar({ key: message }, undefined, 10000);
              } else {
                // Message is TranslationDTO.
                this.snackBarService.openSnackBar(error?.error?.message, undefined, 10000);
              }
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
