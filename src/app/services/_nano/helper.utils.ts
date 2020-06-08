import { Wallet } from 'nanocurrency-web/dist/lib/address-importer';


export class Helper {

  static getWalletAccount(wlt: Wallet) {
    return wlt.accounts[0];
  }

  static getWalletAddr(wlt: Wallet) {
    return wlt?.accounts[0]?.address;
  }

}
