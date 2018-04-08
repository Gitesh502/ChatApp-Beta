import { SocketService } from './../../services/sockets/socket.service';
import { ModalService } from './../../services/modal/modal.service';
import * as _ from 'underscore';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { ChatBoxModel, MessagesModel } from '../../models/chatboxModel';
import { Component, OnInit, Inject } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  public chatBoxes: Array<ChatBoxModel>;
  public selectedUsers: Array<any> = [];
  public friendsList: Array<any> = [];
  public groupName: String = '';
  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    private chatService: ChatService,
    private modalService: ModalService,
    private sharedService: SharedService,
    private socketService: SocketService
  ) {
    this.chatBoxes = new Array<ChatBoxModel>();
    this.friendsList = new Array<any>();
  }

  ngOnInit() {
    this.getGroups();
  }

  openChatBox(event) {
    this.showChatBox(event);
    this.socketService.joinRoom(event.key);
  }



  showChatBox(event) {
    const _that = this;
    const chatboxTopush = _.findWhere(_that.chatBoxes, { key: event.key });
    if (chatboxTopush == null || _.isUndefined(chatboxTopush)) {
      if (_that.chatBoxes == null || _that.chatBoxes.length === 0) {
        event.index = 1;
      } else {
        event.index = _that.chatBoxes.length + 1;
      }
      _that.chatBoxes.push(event);
    }
  }

  closeChatBox(event) {
    const chatBoxToRemove = _.findWhere(this.chatBoxes, { index: event });
    this.chatBoxes = _.without(this.chatBoxes, chatBoxToRemove);
    this.chatBoxes.forEach((item, i) => {
      item.index = i + 1;
    });
  }

  openCreateGroupPopup() {
    this.modalService.open('createGroup');
    const data = this.sharedService.getOnlineUsers();
    this.friendsList = [];
    for (let i = 0; i < data.length; i++) {
      this.friendsList.push(data[i]);
    }
  }

  closeModal(id) {
    this.modalService.close(id);
  }

  selectUser(user) {
    if (this.selectedUsers.indexOf(user) === -1) {
      this.selectedUsers.push(user);
    } else {
      this.unselectedUser(user);
    }
  }

  unselectedUser(user) {
    this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
  }

  isChecked(user) {
    return this.selectedUsers.indexOf(user) > -1 ? true : false;
  }

  checkUser(user, e) {
    if (e.target.checked) {
      this.selectUser(user);
    } else {
      this.unselectedUser(user);
    }
  }

  createGroup() {
    const userIds = _.pluck(this.selectedUsers, 'id');
    const reqModal = {
      userIds: userIds,
      groupName: this.groupName
    };
    this.chatService.createGroup(reqModal)
      .subscribe((data) => {
        const onlineBox = {
          id: data.response.groupId,
          name: data.response.groupName,
          isGroup: true
        };
        this.sharedService.groupChats.push(onlineBox);
        const chatBox = {
          key: data.response.chatId,
          index: 0,
          isGroup: true,
          groupName: data.response.groupName,
          user: null,
          message: '',
          messages: new MessagesModel()
        };
        this.showChatBox(chatBox);
        this.closeModal('createGroup');
        const room = {
          groupId: data.response.groupId,
          userIds: userIds

        };
        this.socketService.createRoom(room);

      }, err => {
        throw err;
      });
  }

  getGroups() {
    this.chatService.getGroups()
      .subscribe((data) => {
        data.response.forEach(element => {
          const onlineBox = {
            id: element.chatId,
            name: element.groupName,
            isGroup: true,
            chatId: element.chatId
          };
          this.sharedService.groupChats.push(onlineBox);
        });
      });
  }
}
