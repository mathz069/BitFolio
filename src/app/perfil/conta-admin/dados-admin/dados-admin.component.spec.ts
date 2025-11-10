import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosAdminComponent } from './dados-admin.component';

describe('DadosAdminComponent', () => {
  let component: DadosAdminComponent;
  let fixture: ComponentFixture<DadosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DadosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
