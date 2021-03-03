import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { reducers } from 'src/app/store/reducers';

describe('AuthInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers, undefined)],
      providers: [AuthInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
