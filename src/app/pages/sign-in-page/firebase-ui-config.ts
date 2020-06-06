import { firebase } from 'firebaseui-angular';

export const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'redirect',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: './chat',

  // tosUrl: '<your-tos-link>',
  // privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  // credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};
