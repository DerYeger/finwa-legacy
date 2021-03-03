import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { HttpProgressBarComponent } from 'src/app/components/http-progress-bar/http-progress-bar.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { MaterialModule } from 'src/app/material/material.module';
import { reducers } from 'src/app/store/reducers';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent, HttpProgressBarComponent],
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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
