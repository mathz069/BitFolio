import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFuncComponent } from './register-func.component';

describe('RegisterFuncComponent', () => {
  let component: RegisterFuncComponent;
  let fixture: ComponentFixture<RegisterFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
