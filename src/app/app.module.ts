import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalRedirectComponent,
  MsalService,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, protectedResources } from './auth-config';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { EditProfileDialog, ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import {
  AddMemberDialog,
  DeleteTrainingDialog,
  EditTeamDialog,
  RemoveMemberDialog,
  TeamPageComponent,
  UpsertTrainingDialog,
} from './pages/team-page/team-page.component';
import { ContactUsPageComponent } from './pages/contact-us-page/contact-us-page.component';
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
import { HttpClientModule } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { FormsModule } from '@angular/forms';
import { UserSettingsComponent } from './pages/settings-page/components/user-settings/user-settings.component';
import {
  DeleteTeamDialog,
  TeamSettingsComponent,
  UpsertTeamDialog,
} from './pages/settings-page/components/team-settings/team-settings.component';
import {
  DeletePostDialog,
  PostSettingsComponent,
  UpsertPostDialog,
} from './pages/settings-page/components/post-settings/post-settings.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';
import { MatNativeDateModule } from '@angular/material/core';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: ['https://muegyetemiropi.onmicrosoft.com/api/access'],
    },
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();
  protectedResourceMap.set(`${protectedResources.api.endpoint}/api/posts`, [{ httpMethod: 'GET', scopes: [] }]);
  protectedResourceMap.set(`${protectedResources.api.endpoint}/api/posts`, [
    { httpMethod: 'POST', scopes: [protectedResources.api.scopeUrl] },
    { httpMethod: 'PUT', scopes: [protectedResources.api.scopeUrl] },
    { httpMethod: 'DELETE', scopes: [protectedResources.api.scopeUrl] },
  ]);
  protectedResourceMap.set(`${protectedResources.api.endpoint}/api/users`, [protectedResources.api.scopeUrl]);
  protectedResourceMap.set(`${protectedResources.api.endpoint}/api/teams`, [protectedResources.api.scopeUrl]);
  protectedResourceMap.set(`${protectedResources.api.endpoint}/api/trainings`, [protectedResources.api.scopeUrl]);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap,
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
    ContactUsPageComponent,
    AllTeamPageComponent,
    SettingsPageComponent,
    NotFoundPageComponent,
    CardComponent,
    CardContentComponent,
    EditProfileDialog,
    EditTeamDialog,
    UpsertTrainingDialog,
    AddMemberDialog,
    UserSettingsComponent,
    TeamSettingsComponent,
    PostSettingsComponent,
    AccessDeniedPageComponent,
    UpsertTeamDialog,
    UpsertPostDialog,
    DeleteTrainingDialog,
    RemoveMemberDialog,
    DeleteTeamDialog,
    DeletePostDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true, width: 500 } },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
