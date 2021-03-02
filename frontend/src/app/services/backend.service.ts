import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/state';
import { Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { HeartbeatResponse } from '../model/api/heartbeat-response';
import { ApiToken } from '../model/api/api-token';
import { Credentials } from '../model/api/credentials';
import { User } from '../model/domain/user';
import { addUserToCache, cacheUsers } from '../store/actions';
import { UserDTO } from '../model/api/user-dto';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public readonly backendUrl$: Observable<string | undefined> = this.store.select('settings').pipe(
    map((settings) => settings.backendUrl),
    distinctUntilChanged()
  );

  public constructor(private readonly store: Store<State>, private readonly http: HttpClient) {}

  public isAuthenticated$(): Observable<boolean> {
    return this.store.select('apiToken').pipe(
      map((apiToken) => apiToken !== undefined),
      distinctUntilChanged()
    );
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

  public login(credentials: Credentials): Observable<HttpEvent<ApiToken>> {
    return this.backendUrl$.pipe(
      filter((url) => url !== undefined),
      mergeMap(
        (url) =>
          this.http.post<ApiToken>(`${url}/auth/login`, credentials, {
            reportProgress: true,
            observe: 'events',
          }) as Observable<HttpEvent<ApiToken>>
      )
    );
  }

  public createUser(user: UserDTO): Observable<User> {
    return this.getBackendUrl((url) => this.http.post<User>(`${url}/api/users`, user)).pipe(tap((createdUser) => this.store.dispatch(addUserToCache({ user: createdUser }))));
  }

  public fetchUsers() {
    this.getBackendUrl((url) => this.http.get<User[]>(`${url}/api/users`)).subscribe((users) => this.store.dispatch(cacheUsers({ users })));
  }

  private getBackendUrl<T>(request: (url: string) => Observable<T>) {
    return this.backendUrl$.pipe(
      filter((url) => url !== undefined) as OperatorFunction<string | undefined, string>,
      mergeMap((url: string) => request(url))
    );
  }
}
