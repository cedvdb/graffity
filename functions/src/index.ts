import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Col, Wallet, EncryptedWallet } from '../../shared/collections';
import { wallet as WalletWeb } from 'nanocurrency-web';
import AES from 'crypto-js/aes';


admin.initializeApp();
const db = admin.firestore();

// creates a default synced wallet for the user
// the users can decide to import their own wallet stored locally if they chose to do so
// but having a default synced wallet makes it easy for newcomers

// we will also encrypt it at first with a default password, then we will let the user change his password
// if he feels like it
export const createWallet = functions.auth.user().onCreate((user) => {
  // default password: NanoRocks, hashed with https://emn178.github.io/online-tools/sha256.html
  const DEFAULT_PW = 'NanoRocks';
  const DEFAULT_PW_HASH = '44e6c658d0164e0f3f8d5f2f68dc0e471ece755272d641e33cdab27c1976a899';
  // this is the wallet generated by the lib, but
  // we don't need multiple accounts so we convert it
  const wlt = WalletWeb.generate();
  const wallet = {
    seed: wlt.seed,
    mnemonic: wlt.mnemonic,
    account: wlt.accounts[0]
  } as Wallet;
  const walletStr = JSON.stringify(wallet);
  const encryptedWallet = AES.encrypt(walletStr, DEFAULT_PW).toString();
  const wltDoc: EncryptedWallet = {
    encrypted: encryptedWallet,
    pwHash: DEFAULT_PW_HASH,
    isDefaultPw: true
  };
  return db.collection(Col.NANO_WALLETS).doc(user.uid).set(wltDoc);
});
