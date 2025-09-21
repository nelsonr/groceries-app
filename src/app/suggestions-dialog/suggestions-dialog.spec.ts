import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsDialog } from './suggestions-dialog';

describe('SuggestionsDialog', () => {
  let component: SuggestionsDialog;
  let fixture: ComponentFixture<SuggestionsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestionsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
