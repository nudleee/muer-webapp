import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { TeamPageComponent } from './pages/team-page/team-page.component';
import { AllTeamPageComponent } from './pages/all-team-page/all-team-page.component';
import { ContactUsPageComponent } from './pages/contact-us-page/contact-us-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [MsalGuard] },
  { path: 'teams/:teamId', component: TeamPageComponent, canActivate: [MsalGuard] },
  { path: 'teams', component: AllTeamPageComponent, canActivate: [MsalGuard] },
  { path: 'contact-us', component: ContactUsPageComponent },
  { path: 'settings', component: SettingsPageComponent, canActivate: [MsalGuard] },
  { path: '404', component: NotFoundPageComponent },
  { path: 'access-denied', component: AccessDeniedPageComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
