import { ConfirmationComponent } from './../components/confirmation/confirmation.component';
import { ThankYouComponent } from './../components/thank-you/thank-you.component';
import { MessengerComponent } from './../components/messenger/messenger.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { WelcomeComponent } from '../components/welcome/welcome.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { TimelineComponent} from '../components/timeline/timeline.component';
import { AboutComponent } from '../components/about/about.component';
import { AuthGuard} from '../guards/auth.guard';
export const AppRoutes: Routes = [
  { path: '', component: HomeComponent ,canActivate:[AuthGuard] },
  { path: 'home', redirectTo: '/Home' },
  { path: 'messenger', redirectTo: '/Messenger' },
  { path: 'Home', component: HomeComponent ,canActivate:[AuthGuard] },
  { path: 'Messenger', component: MessengerComponent ,canActivate:[AuthGuard] },
  { path: 'Welcome', component: WelcomeComponent },
  { path: 'Profile', component: ProfileComponent,canActivate:[AuthGuard] },
  { path: 'Dashboard', component: DashboardComponent,canActivate:[AuthGuard] },
  { path: 'Timeline', component: TimelineComponent,canActivate:[AuthGuard] },
  { path: 'ThankYou', component: ThankYouComponent},
  { path: 'Confirmation', component: ConfirmationComponent},
  { path: 'About', component: AboutComponent,canActivate:[AuthGuard] },
  { path: '**', component: WelcomeComponent },
  // {
  //   path: '',
  //   redirectTo: '/Home',
  //   pathMatch: 'full'
  // },
];
