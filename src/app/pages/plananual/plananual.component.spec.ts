import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlananualComponent } from './plananual.component';

describe('PlananualComponent', () => {
  let component: PlananualComponent;
  let fixture: ComponentFixture<PlananualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlananualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlananualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
