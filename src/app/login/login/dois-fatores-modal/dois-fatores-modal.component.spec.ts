import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoisFatoresModalComponent } from './dois-fatores-modal.component';

describe('DoisFatoresModalComponent', () => {
  let component: DoisFatoresModalComponent;
  let fixture: ComponentFixture<DoisFatoresModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoisFatoresModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoisFatoresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
