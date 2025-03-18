import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaparptprogrampendComponent } from './caparptprogrampend.component';

describe('CaparptprogrampendComponent', () => {
  let component: CaparptprogrampendComponent;
  let fixture: ComponentFixture<CaparptprogrampendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaparptprogrampendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaparptprogrampendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
