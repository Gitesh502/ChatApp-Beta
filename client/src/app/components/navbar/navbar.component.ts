import * as moment from 'moment';
import { Router } from '@angular/router';
import { AppService } from '../../app.services';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { APP_CONFIG } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { LoginModel } from '../../models/loginModel';
import { HelperService } from '../../services/helpers/helper.service';
import { SharedService } from '../../services/shared/shared.service';
import { ChatService } from '../../services/chat/chat.service';
import { AccountService } from '../../services/account/account.service';
import { FriendsService } from '../../services/friends/friends.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatSharedService } from '../../services/chat/chat-shared.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { NotificationsService } from '../../services/notifications/notifications.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  public toggleFriendRequestDropDown: boolean;
  public menuItems: Array<{ menuName: string, urlName: string }>;
  public loginForm: FormGroup;
  public loginModel: LoginModel;
  public formErrors = {
    'loginEmail': '',
    'loginPassword': ''
  };
  public validationMessages = {
    'loginEmail': {
      'required': 'Email is required.',
    },
    'loginPassword': {
      'required': 'Password is required.'
    }
  };
  @ViewChild('configBtn') configBtn: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private helper: HelperService,
    private shared: SharedService,
    private appRouteService: AppService,
    private chatService: ChatService,
    private chatShared: ChatSharedService,
    private friendService: FriendsService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationsService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    this.toggleFriendRequestDropDown = true;
    this.menuItems = new Array();
    this.loginModel = new LoginModel();
  }

  ngOnInit() {
    this.getNotifications();
    this.menuItems = [{
      menuName: 'Home',
      urlName: 'Home'
    },
    {
      menuName: 'Dashboard',
      urlName: 'Dashboard'
    }];
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      'loginEmail': [this.loginModel.userName, [
        Validators.required,
        Validators.email
      ]],
      'loginPassword': [this.loginModel.password, [
        Validators.required
      ]]
    });
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value)
        .subscribe(
        data => {
          this.shared.storeUserData(data.token, data.response,data.socketToken);
          if (data.success) {
            this.shared.loadToken();
            this.router.navigate(['./Home']);
          }
        },
        error => { }
        );
    }
    else {
    }
  }

  onLogoutClick() {
    this.accountService.logout();
    this.router.navigate(['./Welcome']);
  }

  processRequestNofication() {
    this.shared.setReceivedFriendRequest([]);
    //  this.spinnerService.open('parentSpinner');
    this.toggleFriendRequestDropDown = !this.toggleFriendRequestDropDown;
    this.shared.friendRequests = [];
    var reqObj = {
      isFriendCount: true,
      isGlobeCount: false,
      isFriendOpened: true,
      isGlobeOpened: false,
      friendLastOpened: null,
      globeLastOpened: null,
      friendCount: 0
    }
    this.notificationService.updateNotification(reqObj)
      .subscribe(data => {
      });
    this.friendService.getFriendRequests()
      .subscribe((data) => {
        let reqs = [];
        if (data && data.response != null && data.response.length > 0) {
          data.response.forEach((item) => {
            reqs.push(
              {
                status: item.status,
                requestId: item._id,
                requestSentOn: item.requestSentOn,
                requestAcceptedOn: item.requestAcceptedOn,
                to: {
                  id: item.toId._id,
                  firstName: item.toId.firstName,
                  surName: item.toId.surName,
                  imgPath: this.config.apiEndpoint + item.toId.profileImages[0].imagePath + "/" + item.toId.profileImages[0].icon_45X45
                },
                from: {
                  id: item.fromId._id,
                  firstName: item.fromId.firstName,
                  surName: item.fromId.surName,
                  imgPath: this.config.apiEndpoint + item.fromId.profileImages[0].imagePath + "/" + item.fromId.profileImages[0].icon_45X45

                }
              });
          });
        }
        this.shared.setReceivedFriendRequest(reqs);
        //this.spinnerService.close('parentSpinner');
      }, (err) => {
        //this.spinnerService.close('parentSpinner');
        throw new Error(err);
      })
  }

  onRequestAccepted(item) {
    console.log(item);
  }

  getNotifications() {
    var wertYobj = {
      xxy: "zwe"
    };
    this.notificationService.getNotifications()
      .subscribe(data => {
        if (data && data.response[0] && data.response[0] != null) {
          for (let i = 0; i < data.response[0].friendCount; i++) {
            this.shared.friendRequests.push(wertYobj);
          }
        }
      });
  }
}
