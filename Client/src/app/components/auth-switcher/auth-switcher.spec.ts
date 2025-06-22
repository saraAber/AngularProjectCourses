import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSwitcher } from './auth-switcher';

describe('AuthSwitcher', () => {
  let component: AuthSwitcher;
  let fixture: ComponentFixture<AuthSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSwitcher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
