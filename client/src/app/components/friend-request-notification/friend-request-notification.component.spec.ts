import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestNotificationComponent } from './friend-request-notification.component';

describe('FriendRequestNotificationComponent', () => {
  let component: FriendRequestNotificationComponent;
  let fixture: ComponentFixture<FriendRequestNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendRequestNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendRequestNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
