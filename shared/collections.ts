import * as firebase from 'firebase/app';


export enum Col {
  MESSAGES = 'messages',
  MESSAGES_GLOBAL = '',
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
  coordinates: firebase.firestore.GeoPoint;
}

export interface User {
  uid: string;
  username: string;
  image: string;
}
