import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarVagaComponent } from './gerenciar-vagas.component';
describe('GerenciarVagasComponent', () => {
  let component: GerenciarVagaComponent;
  let fixture: ComponentFixture<GerenciarVagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarVagaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarVagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
