import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
export const AppRoutes: Routes = [
  { path: 'Home', component: HomeComponent ,canActivate:[AuthGuard] },
  { path: 'Welcome', component: WelcomeComponent },
  { path: 'Profile', component: ProfileComponent,canActivate:[AuthGuard] },
  { path: 'Dashboard', component: DashboardComponent,canActivate:[AuthGuard] },
  {
    path: '',
    redirectTo: '/Welcome',
    pathMatch: 'full'
  },
  { path: '**', component: WelcomeComponent }
];
