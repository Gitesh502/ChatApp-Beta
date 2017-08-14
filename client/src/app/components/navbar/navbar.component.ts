import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../app.services';
import { LoginModel } from '../../models/loginModel';
import { AccountService } from '../../services/account.service';
import { HelperService } from '../../services/helper.service';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuItems: Array<{ menuName: string, urlName: string }>;
  loginForm: FormGroup;
  public loginModel: LoginModel;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private helper: HelperService,
    private shared:SharedService,
    appRouteService: AppService
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
  formErrors = {
    'loginEmail': '',
    'loginPassword': ''
  };
  validationMessages = {
    'loginEmail': {
      'required': 'Email is required.',
    },
    'loginPassword': {
      'required': 'Password is required.'
    }
  };
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
        error => console.log(error)
        )
    }
    else {
      console.log('invalid');
    }
  }
  onLogoutClick() {
    this.accountService.logout();
    this.router.navigate(['./Welcome']);
  }
}
