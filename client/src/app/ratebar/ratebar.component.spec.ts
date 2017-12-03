import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatebarComponent } from './ratebar.component';

describe('RatebarComponent', () => {
  let component: RatebarComponent;
  let fixture: ComponentFixture<RatebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
