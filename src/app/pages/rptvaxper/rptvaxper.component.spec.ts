import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptvaxperComponent } from './rptvaxper.component';

describe('RptvaxperComponent', () => {
  let component: RptvaxperComponent;
  let fixture: ComponentFixture<RptvaxperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptvaxperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptvaxperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
