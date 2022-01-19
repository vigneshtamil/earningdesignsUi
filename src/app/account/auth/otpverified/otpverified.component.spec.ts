import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpverifiedComponent } from './otpverified.component';

describe('OtpverifiedComponent', () => {
  let component: OtpverifiedComponent;
  let fixture: ComponentFixture<OtpverifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpverifiedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpverifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
