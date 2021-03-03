import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SnackBarService } from 'src/app/services/snack-bar.service';
import { logout } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public constructor(private readonly snackBarService: SnackBarService, private readonly store: Store<State>) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (request.headers.has('authorization') && error.status === 401) {
          this.store.dispatch(logout());
          this.snackBarService.openSnackBar({ key: 'events.login.expired' });
        } else {
          const message = error?.error?.message ?? 'api.error.unknown';
          if (typeof message === 'string') {
            this.snackBarService.openSnackBar({ key: message });
          } else {
            // Message is TranslationDTO.
            this.snackBarService.openSnackBar(error?.error?.message);
          }
        }
        return throwError(error);
      })
    );
  }
}
