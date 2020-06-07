import { Injectable } from '@angular/core';
import { block } from 'nanocurrency-web';
import { AccountInfo, BlockInfo } from './nano.interfaces';
import { Helper } from './helper.utils';
import { Wallet } from 'shared/collections';


@Injectable({ providedIn: 'root' })
export class BlockService {


  async getSignedReceiveBlock(
    wallet: Wallet,
    accountInfo: AccountInfo,
    info: BlockInfo,
    transactionHash: string
  ) {
    const worker = new Worker('./nano.worker', { type: 'module' });
    const hashToCompute = accountInfo.frontier || wallet.account.publicKey;
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
      toAddress: wallet.account.address,
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
    return block.receive(data, wallet.account.privateKey);
  }

  async getSignedSendBlock(
    wallet: Wallet,
    accountInfo: AccountInfo,
    amountRaw: any,
    toAddress: string,
    representativeAddress: string
  ) {
    const worker = new Worker('./nano.worker', { type: 'module' });
    const hashToCompute = accountInfo.frontier || wallet.account.publicKey;
    const work: string = await new Promise(resolve => {
      worker.postMessage(hashToCompute);
      worker.onmessage = ev => {
        resolve(ev.data);
        worker.terminate();
      };
    });
    const data = {
      walletBalanceRaw: accountInfo.balance,
      fromAddress: wallet.account.address,
      toAddress,
      representativeAddress,
      frontier: accountInfo.frontier,
      amountRaw,
      work
    };
    // Returns a correctly formatted and signed block ready to be sent to the blockchain
    return block.send(data, wallet.account.privateKey);
  }
}
