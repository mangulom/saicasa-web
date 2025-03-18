import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptvaxcampComponent } from './rptvaxcamp.component';

describe('RptvaxcampComponent', () => {
  let component: RptvaxcampComponent;
  let fixture: ComponentFixture<RptvaxcampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptvaxcampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptvaxcampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
