import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../store/state';
import { Store } from '@ngrx/store';
import { first, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
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
