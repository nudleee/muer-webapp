import { Inject, Injectable, OnInit } from '@angular/core';
import { IdTokenClaims } from '@azure/msal-common';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  InteractionType,
  PopupRequest,
  RedirectRequest,
  SsoSilentRequest,
} from '@azure/msal-browser';
import { BehaviorSubject, Subject, filter, takeUntil } from 'rxjs';
import { b2cPolicies, msalConfig } from '../auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  currentUser: BehaviorSubject<AccountInfo | null> = new BehaviorSubject<AccountInfo | null>(null);
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
  ) {}

  ngOnInit(): void {
    this.authService.instance.initialize();

    this.authService.instance.addEventCallback((event: any) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        console.log('cb');
        const account = event.payload.account;
        console.log(account);
        this.authService.instance.setActiveAccount(account);
        this.currentUser.next(this.authService.instance.getActiveAccount());
      }
    });
  }

  isAdmin() {
    if (this.currentUser.value == null) {
      return false;
    }
    return this.currentUser.value.idTokenClaims?.['extension_Role'] == 'Admin';
  }

  isCoach() {
    if (this.currentUser.value == null) {
      return false;
    }
    return this.currentUser.value.idTokenClaims?.['extension_Role'] == 'Coach';
  }

  isAuthTokenExpired(account: AccountInfo) {
    return account.idTokenClaims?.exp! < Math.floor(Date.now() / 1000);
  }

  tryForLogin() {
    const accounts = this.authService.instance.getAllAccounts();
    if (accounts.length > 0 && !this.isAuthTokenExpired(accounts[0])) {
      this.authService.instance.setActiveAccount(accounts[0]);
      this.currentUser.next(this.authService.instance.getActiveAccount());
    }
  }

  getUserListener() {
    return this.currentUser;
  }

  login() {
    this.tryForLogin();

    this.authService.instance
      .handleRedirectPromise()
      .then((authResult) => {
        if (authResult != null) this.currentUser.next(authResult?.account);
        const account = this.authService.instance.getActiveAccount();
        if (!account || this.isAuthTokenExpired(account)) {
          this.authService.instance
            .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
            .then((result) => {
              this.authService.instance.setActiveAccount(result.account);
              this.currentUser.next(result.account);
            })
            .catch();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  logout() {
    this.authService.instance.logoutPopup({ account: this.authService.instance.getActiveAccount() }).then((_) => {
      this.currentUser.next(null);
    });
  }
}
