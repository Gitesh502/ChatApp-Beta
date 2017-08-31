import { Router } from '@angular/router';
import { AppService } from '../../app.services';
import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../../models/loginModel';
import { HelperService } from '../../services/helpers/helper.service';
import { SharedService } from '../../services/shared/shared.service';
import { ChatService } from '../../services/chat/chat.service';
import { AccountService } from '../../services/account/account.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatSharedService } from '../../services/chat/chat-shared.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private helper: HelperService,
    private shared:SharedService,
    private appRouteService: AppService,
    private chatService:ChatService,
    private chatShared:ChatSharedService
  ) {
    this.menuItems = new Array();
    this.loginModel = new LoginModel();
  }

  ngOnInit() {
    this.menuItems = [{
      menuName: "Home",
      urlName: "Home"
    },
    {
      menuName: "Dashboard",
      urlName: "Dashboard"
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
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
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
          this.shared.storeUserData(data.token, data.response);
          if (data.success) {
            this.shared.loadToken();
            this.router.navigate(['./Home']);
          }
        },
        error => {}
        )
    }
    else {
    }
  }

  onLogoutClick() {
    this.accountService.logout();
    this.router.navigate(['./Welcome']);
  }
}
