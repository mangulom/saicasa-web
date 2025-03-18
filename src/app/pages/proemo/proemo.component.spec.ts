import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProemoComponent } from './proemo.component';

describe('ProemoComponent', () => {
  let component: ProemoComponent;
  let fixture: ComponentFixture<ProemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
