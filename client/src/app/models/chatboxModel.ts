import { UserModel } from './profileModel';

export class ChatBoxModel {
    public key: string;
    public index: number;
    public user: object;
    public message: string;
    public messages: MessagesModel;
    public isGroup: Boolean;
    public sentTo: string;
    public sentBy: string;
}

export class Conversations {
    public createdOn: Date;
    public message: String;
    public recipient: String;
    public sender: String;
    public sentTo: String;
    public sentBy:String;
}

export class MessagesModel {
    constructor() {
        this.conversation = new Array<Conversations>();
        this.isDelete = false;
        this.userIds = new Array<String>();
    }
    public chatId: String;
    public conversation: Array<Conversations>;
    public isDelete: Boolean;
    public isGroup: Boolean;
    public updatedAt: Date;
    public userIds: Array<String>;
    public _id: String;
}

export class MessengerModel {
    public id: string;
    public UserIds: Array<UserModel>;
    public Messages: Array<Conversations>;
}

export class ChatDisplayed {
    public id: string;
    public senderId: string;
    public recipientId: string;
    public senderName: string;
    public recipientName: string;
    public senderProPic: string;
    public recipientProPic: string;
    public messageDate: Date;
}
