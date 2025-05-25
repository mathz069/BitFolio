import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaFuncComponent } from './conta-func.component';

describe('ContaFuncComponent', () => {
  let component: ContaFuncComponent;
  let fixture: ComponentFixture<ContaFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
