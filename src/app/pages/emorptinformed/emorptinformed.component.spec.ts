import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmorptinformedComponent } from './emorptinformed.component';

describe('EmorptinformedComponent', () => {
  let component: EmorptinformedComponent;
  let fixture: ComponentFixture<EmorptinformedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmorptinformedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmorptinformedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
