import { TestBed, inject } from '@angular/core/testing';

import { ScreenwidthService } from './screenwidth.service';

describe('ScreenwidthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenwidthService]
    });
  });

  it('should be created', inject([ScreenwidthService], (service: ScreenwidthService) => {
    expect(service).toBeTruthy();
  }));
});
