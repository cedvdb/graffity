// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LogLevel } from 'simply-logs';

export const environment = {
  production: false,
  logLevel: LogLevel.ALL,
  firebase: {
    apiKey: 'AIzaSyDxxGC3ts3abk2wUVKqzo_k5z0kLkHyRuU',
    authDomain: 'graffity-dev-b0fa1.firebaseapp.com',
    databaseURL: 'https://graffity-dev-b0fa1.firebaseio.com',
    projectId: 'graffity-dev-b0fa1',
    storageBucket: 'graffity-dev-b0fa1.appspot.com',
    messagingSenderId: '691484867983',
    appId: '1:691484867983:web:990e5c3351ca8d535a9ffa',
    measurementId: 'G-5ZD10582RG'
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
