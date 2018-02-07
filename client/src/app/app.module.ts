
///=================Predefined Modules==================//
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgxSiemaModule } from 'ngx-siema';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, UrlSerializer } from '@angular/router';
import { PushNotificationsModule } from 'angular2-notifications'; // import the module
import { ResponsiveModule } from 'ng2-responsive';

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
import { FriendRequestNotificationComponent } from './components/friend-request-notification/friend-request-notification.component';


///========================End Components===================//

///=========================Services=============================//
import { AppService } from './app.services';
import { ModalService } from './services/modal/modal.service';
import { HelperService } from './services/helpers/helper.service';
import { SharedService } from './services/shared/shared.service';
import { ChatService } from './services/chat/chat.service';
import { SocketService } from './services/sockets/socket.service';
import { SpinnerService } from './services/spinner/spinner.service';
import { ChatSharedService } from './services/chat/chat-shared.service';
import { AccountService } from './services/account/account.service';
import { ProfileService } from './services/profile/profile.service';
import { FriendsService } from './services/friends/friends.service';
import { ProfileItemsService } from './services/profile/profile-items.service';
import { OnlineusersService } from './services/onlineusers/onlineusers.service';
import { NotificationsService } from './services/notifications/notifications.service';
import { TimelineService } from './services/timeline/timeline.service';
import { ScreenwidthService } from './services/screenwidths/screenwidth.service';


///=========================End Services=============================//

///==========================Third Party Plugins==========================//
import { MomentModule } from 'angular2-moment';
import { NgUploaderModule } from 'ngx-uploader';
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

// =============================Other configs===================================//
import { AppRoutes } from './routes/app.routes';
import { AuthGuard } from './guards/auth.guard';
import { APP_CONFIG, AppConfig } from './config/app.config';
import { GlobalErrorHandler } from './services/errorhandler/global-error-handler.service';






// =============================End Other configs===================================//


import { NgxCarouselModule, NgxCarouselStore } from 'ngx-carousel';
import 'hammerjs';


// ============================custom templates============================//
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CommentBoxComponent } from './components/comment-box/comment-box.component';
import { CommentsViewComponent } from './components/comments-view/comments-view.component';

// ===========================end custom templates===========================//


// const chatconfig: SocketIoConfig = { url: 'http://localhost:4001', options: {query:{token:"AppConfig.authToken"}} };

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
    SpinnerComponent,
    FriendRequestNotificationComponent,
    CommentBoxComponent,
    CommentsViewComponent,
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    MomentModule,
    NgUploaderModule,
    NgxCarouselModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgxSiemaModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    PushNotificationsModule,
    ResponsiveModule
  ],
  providers: [
    AppService
    , AccountService
    , HelperService
    , AuthGuard
    , ModalService
    , SharedService
    , ProfileService
    , SocketService
    , { provide: APP_CONFIG, useValue: AppConfig }
    , GroupByPipe
    , ProfileItemsService
    , OnlineusersService
    , ChatService
    , FriendsService
    , ChatSharedService
    , { provide: ErrorHandler, useClass: GlobalErrorHandler }
    , SpinnerService
    , NotificationsService
    , TimelineService
    , ScreenwidthService
  ],
  bootstrap: [AppComponent],
  entryComponents: [TimelineComponent, AboutComponent],
})
export class AppModule { }
