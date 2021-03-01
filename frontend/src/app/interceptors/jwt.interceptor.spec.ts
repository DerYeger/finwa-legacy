import { TestBed } from '@angular/core/testing';
import { JwtInterceptor } from './jwt.interceptor';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../store/reducers';

describe('JwtInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers, undefined)],
      providers: [JwtInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
