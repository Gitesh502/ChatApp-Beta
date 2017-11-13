import { FriendsService } from './services/friends/friends.service';
import { Component } from '@angular/core';
import { ChatService } from './services/chat/chat.service';
import { SocketService } from './services/sockets/socket.service';
import { SharedService } from './services/shared/shared.service';
import { ChatSharedService } from './services/chat/chat-shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(
    private sharedervice: SharedService,
    private chatShared: ChatSharedService,
    private socketService: SocketService
  ) {
    const self = this;
    self.sharedervice.loadToken();
    self.socketService.connect();
    /**
   * Its a function for getting new message when other use sends an message
   * from socket io calling this method
   */
    self.socketService.newMessage()
      .subscribe(data => {
        self.chatShared.pushMessage(data.text.message);
        self.chatShared.newMsgReceived();
      }
      );

    self.socketService.newRequest()
      .subscribe(data => {
        self.sharedervice.friendRequests.push(data);
      }
      );

  }
  changeOfRoutes() {

  }
}
