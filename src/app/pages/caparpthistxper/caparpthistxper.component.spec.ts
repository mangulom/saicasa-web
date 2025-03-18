import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaparpthistxperComponent } from './caparpthistxper.component';

describe('CaparpthistxperComponent', () => {
  let component: CaparpthistxperComponent;
  let fixture: ComponentFixture<CaparpthistxperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaparpthistxperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaparpthistxperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
