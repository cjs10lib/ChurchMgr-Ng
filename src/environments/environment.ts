// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCpQB3awtFJD5o6cMfAg9CL1y58n-MglEw',
    authDomain: 'churchmgr-d21b2.firebaseapp.com',
    databaseURL: 'https://churchmgr-d21b2.firebaseio.com',
    projectId: 'churchmgr-d21b2',
    storageBucket: 'churchmgr-d21b2.appspot.com',
    messagingSenderId: '37870977046'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
