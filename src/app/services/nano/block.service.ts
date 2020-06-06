import { Injectable } from '@angular/core';
import { block } from 'nanocurrency-web';
import { Wallet } from 'nanocurrency-web/dist/lib/address-importer';
import { AccountInfo, BlockInfo } from './nano.interfaces';
import { Helper } from './helper.utils';


@Injectable({ providedIn: 'root' })
export class BlockService {


  async getSignedReceiveBlock(wlt: Wallet, accountInfo: AccountInfo, info: BlockInfo, transactionHash: string) {
    const worker = new Worker('./nano.worker', { type: 'module' });
    const hashToCompute = accountInfo.frontier || Helper.getWalletAccount(wlt).publicKey;
    const work: string = await new Promise(resolve => {
      worker.postMessage(hashToCompute);
      worker.onmessage = ev => {
        resolve(ev.data);
        worker.terminate();
      };
    });
    const data = {
      // Your current balance in RAW
      walletBalanceRaw: accountInfo.balance || '0',
      // Your address
      toAddress: Helper.getWalletAddr(wlt),
      // From wallet info
      representativeAddress: info.contents.representative,
      // From wallet info
      frontier: accountInfo.frontier ||
      '0000000000000000000000000000000000000000000000000000000000000000',
      // From the pending transaction
      transactionHash,
      // From the pending transaction in RAW
      amountRaw: info.amount,
      work
    };
    // Returns a correctly formatted and signed block ready to be sent to the blockchain
    return block.receive(data, Helper.getWalletAccount(wlt).privateKey);
  }

  async getSignedSendBlock(
    wlt: Wallet,
    accountInfo: AccountInfo,
    amountRaw: any,
    toAddress: string,
    representativeAddress: string
  ) {
    const worker = new Worker('./nano.worker', { type: 'module' });
    const hashToCompute = accountInfo.frontier || Helper.getWalletAccount(wlt).publicKey;
    const work: string = await new Promise(resolve => {
      worker.postMessage(hashToCompute);
      worker.onmessage = ev => {
        resolve(ev.data);
        worker.terminate();
      };
    });
    const data = {
      walletBalanceRaw: accountInfo.balance,
      fromAddress: Helper.getWalletAddr(wlt),
      toAddress,
      representativeAddress,
      frontier: accountInfo.frontier,
      amountRaw,
      work
    };
    // Returns a correctly formatted and signed block ready to be sent to the blockchain
    return block.send(data, Helper.getWalletAccount(wlt).privateKey);
  }
}
