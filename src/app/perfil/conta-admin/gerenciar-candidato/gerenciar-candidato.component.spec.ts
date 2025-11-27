import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarCandidatoComponent } from './gerenciar-candidato.component';

describe('GerenciarCandidatoComponent', () => {
  let component: GerenciarCandidatoComponent;
  let fixture: ComponentFixture<GerenciarCandidatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarCandidatoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
