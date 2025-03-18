import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunoproComponent } from './vacunopro.component';

describe('VacunoproComponent', () => {
  let component: VacunoproComponent;
  let fixture: ComponentFixture<VacunoproComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacunoproComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacunoproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
