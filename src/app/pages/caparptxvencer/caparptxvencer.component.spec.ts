import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaparptxvencerComponent } from './caparptxvencer.component';

describe('CaparptxvencerComponent', () => {
  let component: CaparptxvencerComponent;
  let fixture: ComponentFixture<CaparptxvencerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaparptxvencerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaparptxvencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
