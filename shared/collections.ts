import * as firebase from 'firebase/app';
import { Account } from 'nanocurrency-web/dist/lib/address-importer';


export enum Col {
  GLOBAL_MESSAGES = 'global-messages',
  GEO_MESSAGES = 'geo-messages',
  NANO_ADDRESSES = 'nano-addresses',
  NANO_WALLETS = 'nano-wallets',
  PRESENCE = 'presence',
  USER = 'users'
}


export interface NanoAddressesDoc {
  address: string;
}

export interface Message {
  content: string;
  createdBy: {
    uid: string;
    username: string;
    image: string;
    nanoAddress: string
  };
  createdAt: number;
}

export interface GeoMessage extends Message {
  coordinates: firebase.firestore.GeoPoint;
}

export interface User {
  uid: string;
  username: string;
  image: string;
}

export interface Wallet {
  mnemonic: string;
  seed: string;
  account: Account;
}

export interface EncryptedWallet {
  encrypted: string;
  pwHash: string;
  isDefaultPw: true;
}
