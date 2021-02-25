import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { HeartbeatResponse } from '../model/api/heartbeat-response';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public readonly backendUrl$: Observable<string | undefined> = this.store.select('backendConfig').pipe(map((backendConfig) => backendConfig.url));

  public constructor(private readonly store: Store<State>, private readonly http: HttpClient) {}

  public isAuthenticated$(): Observable<boolean> {
    return this.store.select('backendConfig').pipe(map((backendConfig) => backendConfig.apiToken !== undefined));
  }

  public verifyBackendHeartbeat$(url: string): Observable<HttpEvent<HeartbeatResponse>> {
    return this.http.post<HeartbeatResponse>(
      `${url}/heartbeat`,
      { url },
      {
        reportProgress: true,
        observe: 'events',
      }
    ) as Observable<HttpEvent<HeartbeatResponse>>;
  }

  // public login(username: string, password: string): Observable<ApiToken> {
  //   return this.http.get(`${url}/heartbeat`, { responseType: 'text' }).pipe(
  //     catchError(() => of(false)),
  //     map((response) => response === 'FinWa-Backend')
  //   );
  // }
}
