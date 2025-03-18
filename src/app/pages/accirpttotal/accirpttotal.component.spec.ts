import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccirpttotalComponent } from './accirpttotal.component';

describe('AccirpttotalComponent', () => {
  let component: AccirpttotalComponent;
  let fixture: ComponentFixture<AccirpttotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccirpttotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccirpttotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
