import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidenteComponent } from './accidente.component';

describe('AccidenteComponent', () => {
  let component: AccidenteComponent;
  let fixture: ComponentFixture<AccidenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
