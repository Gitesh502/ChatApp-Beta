import { FriendsService } from './services/friends/friends.service';
import { Component } from '@angular/core';
import { ChatService } from './services/chat/chat.service';
import { SocketService } from './services/sockets/socket.service';
import { SharedService } from './services/shared/shared.service';
import { ChatSharedService } from './services/chat/chat-shared.service';
import { NotificationsService } from './services/notifications/notifications.service';
import { PushNotificationsService } from 'angular2-notifications'; // import the service
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
    this.init();
  }

  init() {
    const self = this;
    self._pushNotifications.requestPermission();
    self.sharedervice.loadToken();
    self.socketService.connect();
    self.socketService.receiveMessage()
      .subscribe(data => {
        self.chatShared.pushMessage(data.text.message);
        self.chatShared.newMsgReceived();
        const options = { // set options
          body: data.text.message.message,
          // icon: 'assets/images/ironman.png' // adding an icon
        };
        const notify = this._pushNotifications.create('New Message', options).subscribe( // creates a notification
          res => console.log(res),
          err => console.log(err)
        );
      }
      );

    self.socketService.receiveRequest()
      .subscribe(data => {
        const reqObj = {
          isFriendCount: true,
          isGlobeCount: false,
          isFriendOpened: false,
          isGlobeOpened: false,
          friendLastOpened: null,
          globeLastOpened: null
        };
        this.notificationsService.saveNotification(reqObj)
          .subscribe((test) => {

          });
        self.sharedervice.friendRequests.push(data);
      }
      );

    self.socketService.friendRequestAcceptedNotification()
      .subscribe(data => {
        const reqObj = {
          isFriendCount: true,
          isGlobeCount: false,
          isFriendOpened: false,
          isGlobeOpened: false,
          friendLastOpened: null,
          globeLastOpened: null
        };
        this.notificationsService.saveNotification(reqObj)
          .subscribe(ddata => {

          });
        self.sharedervice.friendRequests.push(data);
      }
      );


    self.socketService.onlineUsers()
      .subscribe(data => {
        data.response.forEach((item) => {
          const isExists = self.sharedervice.onlineUsers.find(x => x.id === item.id);
          if (isExists && isExists != null) {
            self.sharedervice.removeOnlineUsers(isExists);
          }
          if (item != null) {
            const user = {
              firstName: item.firstName,
              surName: item.surName,
              id: item.id,
              img: item.img,
              isOnline: item.isOnline
            };
            self.sharedervice.pushOnlineUsers(user);
          }
        });
      },
        err => {
          alert(err);
        }
      );


    self.socketService.newPost()
      .subscribe((data) => {
        this.sharedervice.notifictaions.push(data);
      });

    self.socketService.newRoom()
      .subscribe((room) => {
        self.socketService.joinRoom(room);
      });
  }

  changeOfRoutes() {
    this.init();
  }
}
