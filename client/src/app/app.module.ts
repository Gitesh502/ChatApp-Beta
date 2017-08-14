import { NgModule } from '@angular/core';
import { NgxSiemaModule } from 'ngx-siema';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AppRoutes } from './app.routes';

import { AppService } from './app.services';
import { AccountService } from './services/account.service';
import { HelperService } from './services/helper.service';
import { SharedService } from './services/shared.service';
import { ProfileService } from './services/profile/profile.service';

import { AuthGuard } from './guards/auth.guard';
import { SharedComponent } from './components/shared/shared.component';

import { APP_CONFIG, AppConfig } from './app.config';

import { MomentModule } from 'angular2-moment';
import { GroupByPipe } from './pipes/group-by-pipe.pipe';
import {TimeAgoPipe} from 'time-ago-pipe';

import {ModalModule} from "ng2-modal";

import { DropzoneModule } from 'angular2-dropzone-wrapper';
import { DropzoneConfigInterface } from 'angular2-dropzone-wrapper';
import { LightboxModule } from 'angular2-lightbox';


const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address: 
  server: 'http://localhost:3000/users/upload',
  maxFilesize: 50,
  acceptedFiles: 'image/*',
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    WelcomeComponent,
    RegisterComponent,
    DashboardComponent,
    SharedComponent,
    GroupByPipe,
    TimeAgoPipe,
  ],
  imports: [
    HttpModule,
    LightboxModule,
    FormsModule,
    BrowserModule,
    ModalModule,
    MomentModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgxSiemaModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    DropzoneModule.forRoot(DROPZONE_CONFIG)
  ],
  providers: [
    AppService
    , AccountService
    , HelperService
    , AuthGuard
    , SharedService
    ,ProfileService
  , { provide: APP_CONFIG, useValue: AppConfig }
  ,GroupByPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
