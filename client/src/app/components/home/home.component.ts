import * as _ from 'underscore';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { chatBoxModel } from '../../models/chatboxModel';
import { Component, OnInit, Inject } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  public chatBoxes: Array<chatBoxModel>;

  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    private chatService: ChatService,
  ) {
    this.chatBoxes = new Array<chatBoxModel>();
  }

  ngOnInit() {
  }

  openChatBox(event) {
    var _that = this;
    _that.chatService.getChatId(event.key)
      .subscribe(data => {
        let chatboxTopush = _.findWhere(_that.chatBoxes, { key: event.user._id });
        if (chatboxTopush == null || _.isUndefined(chatboxTopush)) {
          if (_that.chatBoxes == null || _that.chatBoxes.length == 0)
            event.index = 1;
          else
            event.index = _that.chatBoxes.length + 1
          _that.chatBoxes.push(event);
        }
      },
      err => {
      }
      );
  }

  closeChatBox(event) {
    let chatBoxToRemove = _.findWhere(this.chatBoxes, { index: event });
    this.chatBoxes = _.without(this.chatBoxes, chatBoxToRemove);
    for (let i in this.chatBoxes) {
      this.chatBoxes[i].index = parseInt(i) + 1;
    }
  }
}
