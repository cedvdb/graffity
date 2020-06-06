

export enum Col {
  MESSAGES = 'messages',
  NANO_ADDRESSES = 'nano-addresses',
  NANO_WALLETS = 'nano-wallets',
  PRESENCE = 'presence'
}


export interface NanoAddressesDoc {
  address: string;
}

export interface Message {
  content: string;
  createdBy: {
    uid: string;
    name: string;
    picture: string;
  };
}
