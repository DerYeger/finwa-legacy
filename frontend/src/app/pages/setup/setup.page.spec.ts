import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPage } from './setup.page';

describe('SetupPage', () => {
  let component: SetupPage;
  let fixture: ComponentFixture<SetupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetupPage],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
