// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA3lMF9ovG8EGxyTa4G9udvxhOuaq6Oito',
    authDomain: 'graffity-42ed2.firebaseapp.com',
    databaseURL: 'https://graffity-42ed2.firebaseio.com',
    projectId: 'graffity-42ed2',
    storageBucket: 'graffity-42ed2.appspot.com',
    messagingSenderId: '1052551251897',
    appId: '1:1052551251897:web:4276a6c01d25db01a25868',
    measurementId: 'G-3LX40WGTH3'
  },
  nanoApi: {
    url: 'https://mynano.ninja/api/node'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
