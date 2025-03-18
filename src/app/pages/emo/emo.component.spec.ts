import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmoComponent } from './emo.component';

describe('EmoComponent', () => {
  let component: EmoComponent;
  let fixture: ComponentFixture<EmoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
