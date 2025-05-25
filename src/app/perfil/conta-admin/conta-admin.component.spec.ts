import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaAdminComponent } from './conta-admin.component';

describe('ContaAdminComponent', () => {
  let component: ContaAdminComponent;
  let fixture: ComponentFixture<ContaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
