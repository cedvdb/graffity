import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Col, Wallet } from '../../shared/collections';
import { wallet } from 'nanocurrency-web';

admin.initializeApp();
const db = admin.firestore();

// creates a default synced wallet for the user
// the users can decide to import their own wallet stored locally if they chose to do so
// but having a default synced wallet makes it easy for newcomers
export const createWallet = functions.auth.user().onCreate((user) => {
  const wlt = wallet.generate();
  return db.collection(Col.NANO_WALLETS).doc(user.uid).set({
    seed: wlt.seed,
    mnemonic: wlt.mnemonic,
    account: wlt.accounts[0]
  } as Wallet);
});
