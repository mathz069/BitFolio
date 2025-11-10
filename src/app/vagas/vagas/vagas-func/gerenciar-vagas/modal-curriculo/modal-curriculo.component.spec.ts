import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCurriculoComponent } from './modal-curriculo.component';

describe('ModalCurriculoComponent', () => {
  let component: ModalCurriculoComponent;
  let fixture: ComponentFixture<ModalCurriculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCurriculoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalCurriculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
