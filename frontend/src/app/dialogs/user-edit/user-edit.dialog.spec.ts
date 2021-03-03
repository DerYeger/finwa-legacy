import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditDialog } from './user-edit.dialog';

describe('UserEditDialog', () => {
  let component: UserEditDialog;
  let fixture: ComponentFixture<UserEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEditDialog ]
    })
    .compileComponents();
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
