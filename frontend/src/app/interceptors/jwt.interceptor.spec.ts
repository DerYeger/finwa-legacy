import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { JwtInterceptor } from 'src/app/interceptors/jwt.interceptor';
import { MaterialModule } from 'src/app/material/material.module';
import { reducers } from 'src/app/store/reducers';

describe('JwtInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule, MaterialModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
      providers: [JwtInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
