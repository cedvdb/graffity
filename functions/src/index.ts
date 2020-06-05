import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// export const createToken = functions.auth.user().onCreate((user) => {
//   return db.collection(Col.TOKENS).doc(user.uid).set({ token: uuid() });
// });
