import { LogLevel } from 'simply-logs';

export const environment = {
  production: true,
  logLevel: LogLevel.OFF,
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
  },
  geoIpApi: {
    url: 'http://ip-api.com/json/'
  }
};
