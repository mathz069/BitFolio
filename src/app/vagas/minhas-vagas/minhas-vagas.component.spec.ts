import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasVagasComponent } from './minhas-vagas.component';

describe('MinhasVagasComponent', () => {
  let component: MinhasVagasComponent;
  let fixture: ComponentFixture<MinhasVagasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasVagasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinhasVagasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
