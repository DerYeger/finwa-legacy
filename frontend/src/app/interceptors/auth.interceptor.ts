import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';

import { State } from 'src/app/store/state';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public constructor(private readonly store: Store<State>) {}

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
        return next.handle(request);
      })
    );
  }
}
