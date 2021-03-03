import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import { UserCreationDialog } from 'src/app/dialogs/user-creation/user-creation.dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { reducers } from 'src/app/store/reducers';

describe('UserCreationDialog', () => {
  let component: UserCreationDialog;
  let fixture: ComponentFixture<UserCreationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCreationDialog, UserFormComponent],
      imports: [FormsModule, HttpClientTestingModule, MaterialModule, ReactiveFormsModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
