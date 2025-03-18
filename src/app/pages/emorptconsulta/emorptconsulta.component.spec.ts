import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmorptconsultaComponent } from './emorptconsulta.component';

describe('EmorptconsultaComponent', () => {
  let component: EmorptconsultaComponent;
  let fixture: ComponentFixture<EmorptconsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmorptconsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmorptconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
