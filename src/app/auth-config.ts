import { Configuration } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_sing_in_sign_on',
    editProfile: 'B2C_1_edit_profile',
  },
  authorities: {
    signUpSignIn: {
      authority: `https://${environment.tenant}.b2clogin.com/${environment.tenant}.onmicrosoft.com/B2C_1_sing_in_sign_on`,
    },
    editProfile: {
      authority: `https://${environment.tenant}.b2clogin.com/${environment.tenant}.onmicrosoft.com/B2C_1_edit_profile`,
    },
  },
  authorityDomain: `${environment.tenant}.b2clogin.com`,
};

export const msalConfig: Configuration = {
  auth: {
    clientId: `${environment.clientID}`,
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: `${environment.redirectURL}`,
  },
  // More configuration here
};

export const protectedResources = {
  muerAPI: {
    endpoint: 'http://localhost:4200',
    scopes: ['https://muegyetemiropi.onmicrosoft.com/api/read', 'https://muegyetemiropi.onmicrosoft.com/api/write'],
  },
};
