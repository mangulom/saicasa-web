import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedidacorrectivaComponent } from './medidacorrectiva.component';

describe('MedidacorrectivaComponent', () => {
  let component: MedidacorrectivaComponent;
  let fixture: ComponentFixture<MedidacorrectivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedidacorrectivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedidacorrectivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
