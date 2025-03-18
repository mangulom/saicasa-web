import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcapacitacionComponent } from './procapacitacion.component';

describe('ProcapacitacionComponent', () => {
  let component: ProcapacitacionComponent;
  let fixture: ComponentFixture<ProcapacitacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcapacitacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcapacitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
