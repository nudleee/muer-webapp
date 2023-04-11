import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { TeamPageComponent } from './pages/team-page/team-page.component';
import { AllTeamPageComponent } from './pages/all-team-page/all-team-page.component';
import { ContacUsPageComponent } from './pages/contac-us-page/contac-us-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
  {path: "", component: HomePageComponent},
  {path:"profile", component:ProfilePageComponent, canActivate:[MsalGuard]},
  {path:"team", component: TeamPageComponent, canActivate: [MsalGuard]},
  {path: "all-team", component:AllTeamPageComponent, canActivate:[MsalGuard]},
  {path:'contact-us', component:ContacUsPageComponent},
  {path: 'settings', component:SettingsPageComponent, canActivate: [MsalGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
