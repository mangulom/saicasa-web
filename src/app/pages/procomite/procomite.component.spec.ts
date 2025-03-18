import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcomiteComponent } from './procomite.component';

describe('ProcomiteComponent', () => {
  let component: ProcomiteComponent;
  let fixture: ComponentFixture<ProcomiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcomiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcomiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
