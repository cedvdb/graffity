

export enum Col {
  MESSAGES = 'messages',
  NANO_ADDRESSES = 'nano-addresses',
}


export interface NanoAddressesDoc {
  addresses: string[];
}

export interface Message {
  content: string;
  createdBy: {
    uid: string;
    name: string;
    picture: string;
  };
}
