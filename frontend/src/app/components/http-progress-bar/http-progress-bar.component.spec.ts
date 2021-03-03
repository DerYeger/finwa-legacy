import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import { HttpProgressBarComponent } from 'src/app/components/http-progress-bar/http-progress-bar.component';
import { MaterialModule } from 'src/app/material/material.module';
import { reducers } from 'src/app/store/reducers';

describe('HttpProgressBarComponent', () => {
  let component: HttpProgressBarComponent<unknown>;
  let fixture: ComponentFixture<HttpProgressBarComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HttpProgressBarComponent],
      imports: [LoggerTestingModule, MaterialModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpProgressBarComponent);
    component = fixture.componentInstance;
    component.requests = of();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
