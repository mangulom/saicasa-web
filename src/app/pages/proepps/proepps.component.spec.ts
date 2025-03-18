import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProeppsComponent } from './proepps.component';

describe('ProeppsComponent', () => {
  let component: ProeppsComponent;
  let fixture: ComponentFixture<ProeppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProeppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProeppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
