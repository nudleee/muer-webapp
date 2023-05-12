import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalModule,
  MsalRedirectComponent,
  MsalService,
} from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './auth-config';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { EditProfileDialog, ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TeamPageComponent } from './pages/team-page/team-page.component';
import { ContacUsPageComponent } from './pages/contac-us-page/contac-us-page.component';
import { AllTeamPageComponent } from './pages/all-team-page/all-team-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from './components/card/card.component';
import { CardContentComponent } from './components/card-content/card-content.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

import { FormsModule } from '@angular/forms';
import { UserSettingsComponent } from './pages/settings-page/components/user-settings/user-settings.component';
import { TeamSettingsComponent } from './pages/settings-page/components/team-settings/team-settings.component';
import { PostSettingsComponent } from './pages/settings-page/components/post-settings/post-settings.component';

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
    SettingsPageComponent,
    NotFoundPageComponent,
    CardComponent,
    CardContentComponent,
    EditProfileDialog,
    UserSettingsComponent,
    TeamSettingsComponent,
    PostSettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, width: 500 } },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
