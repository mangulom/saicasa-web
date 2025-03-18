import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmorptaptimedComponent } from './emorptaptimed.component';

describe('EmorptaptimedComponent', () => {
  let component: EmorptaptimedComponent;
  let fixture: ComponentFixture<EmorptaptimedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmorptaptimedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmorptaptimedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
