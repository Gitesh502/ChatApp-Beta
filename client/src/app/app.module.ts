
///=================Predefined Modules==================//
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgxSiemaModule } from 'ngx-siema';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, UrlSerializer } from '@angular/router';
///=================End Predefined Modules==================//

///=====================Components=======================//
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SharedComponent } from './components/shared/shared.component';
import { LeftbarComponent } from './components/leftbar/leftbar.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { RegisterComponent } from './components/register/register.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MessengerComponent } from './components/messenger/messenger.component';
import { OnlineusersComponent } from './components/onlineusers/onlineusers.component';
import { FindFriendsComponent } from './components/find-friends/find-friends.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

///========================End Components===================//

///=========================Services=============================//
import { AppService } from './app.services';
import { ModalService } from './services/modal/modal.service';
import { HelperService } from './services/helpers/helper.service';
import { SharedService } from './services/shared/shared.service';
import { ChatService } from './services/chat/chat.service';
import { ChatSharedService } from './services/chat/chat-shared.service';
import { AccountService } from './services/account/account.service';
import { ProfileService } from './services/profile/profile.service';
import { ProfileItemsService } from './services/profile/profile-items.service';
import { OnlineusersService } from './services/onlineusers/onlineusers.service';

///=========================End Services=============================//

///==========================Third Party Plugins==========================//
import { MomentModule } from 'angular2-moment';
import { NgUploaderModule } from 'ngx-uploader';
import { LightboxModule } from 'angular2-lightbox';
import { DropzoneModule } from 'angular2-dropzone-wrapper';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { DropzoneConfigInterface } from 'angular2-dropzone-wrapper';
import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';
///==========================End Third Party Plugins==========================//

///==========================User defined Directives=======================================//
import { ModalComponent } from './directives/modal.component';
import { AboutDirective } from './directives/about/about.directive';
import { ProfileDirective } from './directives/profile/profile.directive';
import { TimelineDirective } from './directives/timeline/timeline.directive';

///==========================End User defined Directives=======================================//

///============================User Defined Pipes======================================//
import { TimeAgoPipe } from 'time-ago-pipe';
import { GroupByPipe } from './pipes/group-by-pipe.pipe';
///============================End User Defined Pipes======================================//

//=============================Other configs===================================//
import { AppRoutes } from './routes/app.routes';
import { AuthGuard } from './guards/auth.guard';
import { APP_CONFIG, AppConfig } from './config/app.config';





//=============================End Other configs===================================//

//const chatconfig: SocketIoConfig = { url: 'http://localhost:4001', options: {query:{token:"AppConfig.authToken"}} };

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  server: 'http://localhost:3000/users/upload',
  maxFilesize: 50,
  acceptedFiles: 'image/*',
};

@NgModule({
  declarations: [
    GroupByPipe,
    TimeAgoPipe,
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    ModalComponent,
    AboutDirective,
    NavbarComponent,
    SharedComponent,
    ProfileComponent,
    WelcomeComponent,
    ChatboxComponent,
    ProfileDirective,
    LeftbarComponent,
    RegisterComponent,
    FileDropDirective,
    TimelineDirective,
    TimelineComponent,
    DashboardComponent,
    MessengerComponent,
    FileSelectDirective,
    OnlineusersComponent,
    FindFriendsComponent,
    ThankYouComponent,
    ConfirmationComponent,
  ],
  imports: [
    HttpModule,
    LightboxModule,
    FormsModule,
    BrowserModule,
    MomentModule,
    NgUploaderModule,
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
    , ModalService
    , SharedService
    , ProfileService
    , { provide: APP_CONFIG, useValue: AppConfig }
    , GroupByPipe
    , ProfileItemsService
    , OnlineusersService
    , ChatService
    , ChatSharedService
  ],
  bootstrap: [AppComponent],
  entryComponents: [TimelineComponent, AboutComponent],
})
export class AppModule { }
