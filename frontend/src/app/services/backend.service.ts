import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/state';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public constructor(private readonly store: Store<State>, private readonly http: HttpClient) {}

  public isAuthenticated$(): Observable<boolean> {
    return this.store.select('backendConfig').pipe(map((backendConfig) => backendConfig.jwt !== undefined));
  }

  public verifyBackendHeartbeat$(url: string): Observable<boolean> {
    return this.http.get(`${url}/heartbeat`, { responseType: 'text' }).pipe(
      catchError(() => of(false)),
      map((response) => response === 'FinWa-Backend')
    );
  }
}
