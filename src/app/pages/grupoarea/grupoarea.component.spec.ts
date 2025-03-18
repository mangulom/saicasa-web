import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoareaComponent } from './grupoarea.component';

describe('GrupoareaComponent', () => {
  let component: GrupoareaComponent;
  let fixture: ComponentFixture<GrupoareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
