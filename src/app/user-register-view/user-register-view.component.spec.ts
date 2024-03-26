import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegisterViewComponent } from './user-register-view.component';

describe('UserRegisterViewComponent', () => {
  let component: UserRegisterViewComponent;
  let fixture: ComponentFixture<UserRegisterViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRegisterViewComponent]
    });
    fixture = TestBed.createComponent(UserRegisterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
