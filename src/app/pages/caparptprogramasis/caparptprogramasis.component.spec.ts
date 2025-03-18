import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaparptprogramasisComponent } from './caparptprogramasis.component';

describe('CaparptprogramasisComponent', () => {
  let component: CaparptprogramasisComponent;
  let fixture: ComponentFixture<CaparptprogramasisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaparptprogramasisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaparptprogramasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
