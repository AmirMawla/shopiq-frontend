import { TestBed } from '@angular/core/testing';

import { VendorAnalyticsService } from './vendor-analytics';

describe('VendorAnalyticsService', () => {
  let service: VendorAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

