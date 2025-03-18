import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccirptconsultaComponent } from './accirptconsulta.component';

describe('AccirptconsultaComponent', () => {
  let component: AccirptconsultaComponent;
  let fixture: ComponentFixture<AccirptconsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccirptconsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccirptconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
