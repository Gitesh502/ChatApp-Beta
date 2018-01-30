import { MessagesModel } from '../../models/chatboxModel';
import { ChatService } from './../../services/chat/chat.service';
import { Component, OnInit, EventEmitter, Output ,Inject} from '@angular/core';
import { OnlineUserModel } from '../../models/onlineUserModel';
import { OnlineusersService } from '../../services/onlineusers/onlineusers.service';
import { SharedService } from '../../services/shared/shared.service';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
@Component({
  selector: 'app-onlineusers',
  templateUrl: './onlineusers.component.html',
  styleUrls: ['./onlineusers.component.css']
})
export class OnlineusersComponent implements OnInit {
  public OnlineUsers: Array<OnlineUserModel>;
  @Output() chatOpened = new EventEmitter<object>();


  constructor(
    private onlineService: OnlineusersService,
    private chatService: ChatService,
    private shared:SharedService,
      @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    this.OnlineUsers = new Array<OnlineUserModel>();
  }

  ngOnInit() {
    //this.getUsers();
  }

  getUsers() {
    this.onlineService.getUsers()
      .subscribe(
      data => {
        this.OnlineUsers = data.response;
      },
      err => {
      }
      );
  }

  openChat(user) {
    const chatBox = {
      key: user.id,
      index: 0,
      user: user,
      message: '',
      messages: new MessagesModel()
    };
    this.chatOpened.emit(chatBox);
  }

}
