import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmorptparanormaComponent } from './emorptparanorma.component';

describe('EmorptparanormaComponent', () => {
  let component: EmorptparanormaComponent;
  let fixture: ComponentFixture<EmorptparanormaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmorptparanormaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmorptparanormaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
