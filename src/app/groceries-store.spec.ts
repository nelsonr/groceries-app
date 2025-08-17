import { TestBed } from '@angular/core/testing';

import { GroceriesStore } from './groceries-store';

describe('GroceriesStore', () => {
  let service: GroceriesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceriesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
