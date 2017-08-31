import { Component } from '@angular/core';
import { ChatService } from './services/chat/chat.service';
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
    private chatService: ChatService,
    private sharedervice: SharedService,
    private chatShared: ChatSharedService,
  ) {
    var self = this;
    self.sharedervice.loadToken();
    /**
   * Its a function for getting new message when other use sends an message
   * from socket io calling this method 
   */
    self.chatService.newMessage()
      .subscribe(data => {
        self.chatShared.pushMessage(data.text.message);
        self.chatShared.newMsgReceived();
      }
      );
  }
  changeOfRoutes() {

  }
}
