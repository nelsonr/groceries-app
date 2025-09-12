import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCounter } from './progress-counter';

describe('ProgressCounter', () => {
  let component: ProgressCounter;
  let fixture: ComponentFixture<ProgressCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressCounter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressCounter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
