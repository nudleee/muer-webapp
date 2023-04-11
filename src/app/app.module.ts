import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import {msalConfig} from "./auth-config";
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TeamPageComponent } from './pages/team-page/team-page.component';
import { ContacUsPageComponent } from './pages/contac-us-page/contac-us-page.component';
import { AllTeamPageComponent } from './pages/all-team-page/all-team-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component'

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { 
      interactionType: InteractionType.Redirect,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ProfilePageComponent,
    HeaderComponent,
    FooterComponent,
    TeamPageComponent,
    ContacUsPageComponent,
    AllTeamPageComponent,
    SettingsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    MsalModule
    
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }