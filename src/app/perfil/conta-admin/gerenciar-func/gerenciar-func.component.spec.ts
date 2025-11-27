import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarFuncComponent } from './gerenciar-func.component';

describe('GerenciarFuncComponent', () => {
  let component: GerenciarFuncComponent;
  let fixture: ComponentFixture<GerenciarFuncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarFuncComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
