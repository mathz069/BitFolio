import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashFuncComponent } from './dash-func.component';

describe('DashFuncComponent', () => {
  let component: DashFuncComponent;
  let fixture: ComponentFixture<DashFuncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashFuncComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
