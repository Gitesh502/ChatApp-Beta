import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { FriendsService } from '../../services/friends/friends.service';
import { SharedService } from '../../services/shared/shared.service';
import { SocketService } from './../../services/sockets/socket.service';

@Component({
  selector: 'app-friend-request-notification',
  templateUrl: './friend-request-notification.component.html',
  styleUrls: ['./friend-request-notification.component.css']
})
export class FriendRequestNotificationComponent implements OnInit, AfterViewInit {

  @Input() data: any;
  public isButtonLoading: Boolean = false;
  public isShowSpinner: any;
  @Output() onRequestAccepted = new EventEmitter();


  constructor(
    private spinnerService: SpinnerService
    , private friendService: FriendsService
    , private shared: SharedService
    , private socketService: SocketService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  confirmRequest(item) {
    this.isButtonLoading = true;
    this.spinnerService.show("childSpinner" + item.requestId);
    let reqObj = {
      reqId: item.requestId
    }

    this.friendService.confirmRequest(reqObj)
      .subscribe(data => {
        this.onRequestAccepted.emit({
          value: item
        });
        this.shared.onlineUsers.push(data.response);
        this.socketService.friendRequestAccepted(item.from.id);
        this.shared.removeFriendRequest(item);
        this.isButtonLoading = false;
        this.spinnerService.hide('childSpinner' + item.requestId);
      }, err => {
        this.isButtonLoading = false;
        throw new Error(err);
      });

  }

  deleteRequest(item) {
    this.isButtonLoading = true;
    this.spinnerService.show("childSpinner" + item.requestId);
    let reqObj = {
      reqId: item.requestId
    }

    this.friendService.deleteRequest(reqObj)
      .subscribe(data => {
        this.shared.removeFriendRequest(item);
        this.isButtonLoading = false;
        this.spinnerService.hide('childSpinner' + item.requestId);
      }, err => {
        this.isButtonLoading = false;
        throw new Error(err);
      });

  }
}
