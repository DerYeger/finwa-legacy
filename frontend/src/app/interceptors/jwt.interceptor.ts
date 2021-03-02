import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { State } from '../store/state';
import { Store } from '@ngrx/store';
import { catchError, first, map, mergeMap } from 'rxjs/operators';
import { logout } from '../store/actions';
import { SnackBarService } from '../services/snack-bar.service';

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
            console.table(error);
            if (jwt !== undefined && error.status === 401) {
              this.store.dispatch(logout());
              this.snackBarService.openSnackBar({ key: 'events.login.expired' });
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
