import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmosemaforoComponent } from './emosemaforo.component';

describe('EmosemaforoComponent', () => {
  let component: EmosemaforoComponent;
  let fixture: ComponentFixture<EmosemaforoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmosemaforoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmosemaforoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
