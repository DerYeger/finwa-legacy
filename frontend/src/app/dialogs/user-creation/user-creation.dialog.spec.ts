import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationDialog } from './user-creation.dialog';

describe('UserCreationDialog', () => {
  let component: UserCreationDialog;
  let fixture: ComponentFixture<UserCreationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCreationDialog],
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
