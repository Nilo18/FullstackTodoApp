import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetVerificationComponent } from './password-reset-verification.component';

describe('PasswordResetVerificationComponent', () => {
  let component: PasswordResetVerificationComponent;
  let fixture: ComponentFixture<PasswordResetVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordResetVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordResetVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
