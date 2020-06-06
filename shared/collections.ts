

export enum Col {
  MESSAGES = 'messages',
  NANO_ADDRESSES = 'nano-addresses',
  NANO_WALLETS = 'nano-wallets',
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
