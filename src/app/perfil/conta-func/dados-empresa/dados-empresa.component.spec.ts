import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosEmpresaComponent } from './dados-empresa.component';

describe('DadosEmpresaComponent', () => {
  let component: DadosEmpresaComponent;
  let fixture: ComponentFixture<DadosEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DadosEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
