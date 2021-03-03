import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { BackendConfigComponent } from 'src/app/components/backend-config/backend-config.component';
import { HttpProgressBarComponent } from 'src/app/components/http-progress-bar/http-progress-bar.component';
import { MaterialModule } from 'src/app/material/material.module';
import { reducers } from 'src/app/store/reducers';

describe('BackendConfigComponent', () => {
  let component: BackendConfigComponent;
  let fixture: ComponentFixture<BackendConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackendConfigComponent, HttpProgressBarComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers, undefined),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
