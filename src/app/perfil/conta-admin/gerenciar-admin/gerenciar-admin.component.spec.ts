import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarAdminComponent } from './gerenciar-admin.component';

describe('GerenciarAdminComponent', () => {
  let component: GerenciarAdminComponent;
  let fixture: ComponentFixture<GerenciarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerenciarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
