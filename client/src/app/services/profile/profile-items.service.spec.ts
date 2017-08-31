import { TestBed, inject } from '@angular/core/testing';

import { ProfileItemsService } from './profile-items.service';

describe('ProfileItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileItemsService]
    });
  });

  it('should be created', inject([ProfileItemsService], (service: ProfileItemsService) => {
    expect(service).toBeTruthy();
  }));
});
