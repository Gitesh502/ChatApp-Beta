import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineusersComponent } from './onlineusers.component';

describe('OnlineusersComponent', () => {
  let component: OnlineusersComponent;
  let fixture: ComponentFixture<OnlineusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
