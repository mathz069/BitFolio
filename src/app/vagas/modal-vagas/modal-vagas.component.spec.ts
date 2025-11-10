import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVagasComponent } from './modal-vagas.component';

describe('ModalVagasComponent', () => {
  let component: ModalVagasComponent;
  let fixture: ComponentFixture<ModalVagasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVagasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalVagasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
