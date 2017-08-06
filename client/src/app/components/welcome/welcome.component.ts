import { NgxSiemaOptions, NgxSiemaService } from 'ngx-siema';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterModel } from '../../models/registerModel';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  registerForm: FormGroup;
  registerModel: RegisterModel;
  days: any;
  months: any;
  years: any;
  options: NgxSiemaOptions = {
    selector: '.siema',
    duration: 200,
    easing: 'ease-out',
    perPage: 1,
    startIndex: 0,
    draggable: true,
    threshold: 20,
    loop: true,
    onInit: () => {
      setInterval(() => {
        this.next();
      }, 2500);
      // runs immediately after first initialization
    },
    onChange: () => {
      // runs after slide change
    },
  };

  constructor(
    private router: Router,
    private ngxSiemaService: NgxSiemaService,
    private fb: FormBuilder,
    private accountService: AccountService
  ) {

    this.registerModel = new RegisterModel();
    this.days = new Array();
    this.months = new Array();
    this.years = new Array();
    for (var i = 1; i <= 31; i++) {
      this.days.push(i);
    }
    for (var i = 1; i <= 12; i++) {
      this.months.push(i);
    }
    for (var i = 1990; i <= 2017; i++) {
      this.years.push(i);
    }
  }
  buildForm() {
    this.registerForm = this.fb.group({
      'firstName': [this.registerModel.firstName, [
        Validators.required
      ]],
      'surName': [this.registerModel.surName, [
        Validators.required
      ]],
      'email': [this.registerModel.email, [
        Validators.required,
        Validators.email
      ]],
      'password': [this.registerModel.password, [
        Validators.required
      ]],
      'birthday': [this.registerModel.birthday, [
        Validators.required
      ]],
      'birthmonth': [this.registerModel.birthmonth, [
        Validators.required
      ]],
      'birthyear': [this.registerModel.birthyear, [
        Validators.required
      ]],
      'gender': [this.registerModel.gender, [
        Validators.required
      ]]
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  next() {
    this.ngxSiemaService.next();
    //.subscribe((data: any) => console.log(data));
  }
  onRegisterSubmit(value: any): void {
    console.log(value);
    if (this.registerForm.valid) {
      this.accountService.registerUser(value)
        .subscribe(
        data => {
          if (data.success) {
            this.router.navigate(['./Home']);
          }
        },
        error => { console.log(error) }
        )
    }
    else {
      console.log('invalid')
    }
  }
}
