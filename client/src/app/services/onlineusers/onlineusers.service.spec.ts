import { TestBed, inject } from '@angular/core/testing';

import { OnlineusersService } from './onlineusers.service';

describe('OnlineusersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnlineusersService]
    });
  });

  it('should be created', inject([OnlineusersService], (service: OnlineusersService) => {
    expect(service).toBeTruthy();
  }));
});
