import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecoEmpresaComponent } from './endereco-empresa.component';

describe('EnderecoEmpresaComponent', () => {
  let component: EnderecoEmpresaComponent;
  let fixture: ComponentFixture<EnderecoEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnderecoEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnderecoEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
