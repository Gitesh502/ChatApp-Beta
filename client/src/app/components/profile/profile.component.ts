import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { AccountService } from  '../../services/account.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:Object;
  constructor(
    private accountService:AccountService,
    private router:Router
  ) { }

  ngOnInit() {
    this.accountService.getProfile()
    .subscribe(
      profile=>{
        this.user=profile.response;
      },
      err=>{
        console.log(err);
      }
    )
  }

}
