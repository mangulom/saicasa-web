import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiasdmComponent } from './diasdm.component';

describe('DiasdmComponent', () => {
  let component: DiasdmComponent;
  let fixture: ComponentFixture<DiasdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiasdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiasdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
