import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaparptoblignoasisComponent } from './caparptoblignoasis.component';

describe('CaparptoblignoasisComponent', () => {
  let component: CaparptoblignoasisComponent;
  let fixture: ComponentFixture<CaparptoblignoasisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaparptoblignoasisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaparptoblignoasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
