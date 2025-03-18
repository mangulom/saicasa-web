import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptvaxareaComponent } from './rptvaxarea.component';

describe('RptvaxareaComponent', () => {
  let component: RptvaxareaComponent;
  let fixture: ComponentFixture<RptvaxareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptvaxareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptvaxareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
