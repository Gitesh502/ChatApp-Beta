import { TestBed, inject } from '@angular/core/testing';

import { ChatSharedService } from './chat-shared.service';

describe('ChatSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatSharedService]
    });
  });

  it('should be created', inject([ChatSharedService], (service: ChatSharedService) => {
    expect(service).toBeTruthy();
  }));
});
