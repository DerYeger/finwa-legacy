import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import { UserEditDialog } from 'src/app/dialogs/user-edit/user-edit.dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { User } from 'src/app/model/domain/user';
import { reducers } from 'src/app/store/reducers';

describe('UserEditDialog', () => {
  let component: UserEditDialog;
  let fixture: ComponentFixture<UserEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserEditDialog, UserFormComponent],
      imports: [FormsModule, HttpClientTestingModule, MaterialModule, ReactiveFormsModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 'test-id',
            name: 'test-name',
          } as User,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
