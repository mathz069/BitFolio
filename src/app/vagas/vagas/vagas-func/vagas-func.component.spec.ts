import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VagasFuncComponent } from './vagas-func.component';

describe('VagasFuncComponent', () => {
  let component: VagasFuncComponent;
  let fixture: ComponentFixture<VagasFuncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VagasFuncComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VagasFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
