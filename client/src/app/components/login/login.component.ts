import { Router } from '@angular/router';
import { AccountService } from './../../services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../../models/loginModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared/shared.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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
    private accountService: AccountService,
    private router: Router,
    private shared: SharedService,
  ) {
    this.loginModel = new LoginModel();
   }

  ngOnInit() {
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
    }else {
    }
  }

}
