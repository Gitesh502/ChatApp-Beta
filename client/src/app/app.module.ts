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
import {AccountService } from './services/account.service';
import {HelperService } from './services/helper.service';

import {AuthGuard} from './guards/auth.guard';


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
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NgxSiemaModule.forRoot(),
    RouterModule.forRoot(AppRoutes),
  ],
  providers: [AppService,AccountService,HelperService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
