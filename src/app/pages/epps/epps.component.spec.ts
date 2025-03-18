import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EppsComponent } from './epps.component';

describe('EppsComponent', () => {
  let component: EppsComponent;
  let fixture: ComponentFixture<EppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
