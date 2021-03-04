import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { AppComponent } from 'src/app/app.component';
import { MaterialModule } from 'src/app/material/material.module';
import { reducers } from 'src/app/store/reducers';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        LoggerTestingModule,
        MaterialModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        StoreModule.forRoot(reducers, undefined),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
