import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvacunacionComponent } from './provacunacion.component';

describe('ProvacunacionComponent', () => {
  let component: ProvacunacionComponent;
  let fixture: ComponentFixture<ProvacunacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvacunacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvacunacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
