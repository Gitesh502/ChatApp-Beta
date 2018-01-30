import { FriendsService } from './services/friends/friends.service';
import { Component } from '@angular/core';
import { ChatService } from './services/chat/chat.service';
import { SocketService } from './services/sockets/socket.service';
import { SharedService } from './services/shared/shared.service';
import { ChatSharedService } from './services/chat/chat-shared.service';
import { NotificationsService } from './services/notifications/notifications.service';
import { PushNotificationsService } from 'angular2-notifications'; //import the service
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  constructor(
    private sharedervice: SharedService,
    private chatShared: ChatSharedService,
    private socketService: SocketService,
    private notificationsService: NotificationsService,
    private _pushNotifications: PushNotificationsService
  ) {
    const self = this;
    _pushNotifications.requestPermission(); // request for permission as soon as component loads
    self.sharedervice.loadToken();
    self.socketService.connect();
    /**
   * Its a function for getting new message when other use sends an message
   * from socket io calling this method
   */
    self.socketService.receiveMessage()
      .subscribe(data => {
        self.chatShared.pushMessage(data.text.message);
        self.chatShared.newMsgReceived();
        let options = { //set options
    body: "The truth is, I'am Iron Man!",
    icon: "assets/images/ironman.png" //adding an icon
  }
  let notify = this._pushNotifications.create('Iron Man', options).subscribe( //creates a notification
      res => console.log(res),
      err => console.log(err)
  );
      }
      );

    self.socketService.receiveRequest()
      .subscribe(data => {
        var reqObj = {
          isFriendCount: true,
          isGlobeCount: false,
          isFriendOpened: false,
          isGlobeOpened: false,
          friendLastOpened: null,
          globeLastOpened: null
        }
        this.notificationsService.saveNotification(reqObj)
          .subscribe(data => {

          });
        self.sharedervice.friendRequests.push(data);
      }
      );

    self.socketService.friendRequestAcceptedNotification()
      .subscribe(data => {
        var reqObj = {
          isFriendCount: true,
          isGlobeCount: false,
          isFriendOpened: false,
          isGlobeOpened: false,
          friendLastOpened: null,
          globeLastOpened: null
        }
        this.notificationsService.saveNotification(reqObj)
          .subscribe(data => {

          });
        self.sharedervice.friendRequests.push(data);
      }
      );


    self.socketService.onlineUsers()
      .subscribe(data => {
        data.response.forEach((item) => {
          var isExists=self.sharedervice.onlineUsers.find(x=>x.id==item.id);
          if(isExists && isExists!=null)
          {
            self.sharedervice.removeOnlineUsers(isExists);
          }
          if (item != null) {
            var user = {
              firstName: item.firstName,
              surName: item.surName,
              id: item.id,
              img: item.img,
              isOnline:item.isOnline
            };
            self.sharedervice.pushOnlineUsers(user);
          }
        });
      },
      err=>{
        alert(err)
      }
      );

  }
  changeOfRoutes() {

  }
}
