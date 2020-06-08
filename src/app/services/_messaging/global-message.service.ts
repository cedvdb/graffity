import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { Observable } from 'rxjs';
import { Message, Col } from 'shared/collections';
import { UserService } from '../user.service';
import { WalletService } from '../wallet.service';


@Injectable({ providedIn: 'root' })
export class GlobalMessageService {

  messages$: Observable<Message[]>;

  constructor(
    private firestore: AngularFirestore,
    private userSrv: UserService,
    private walletSrv: WalletService
  ) { }

  init() {
    this.messages$ = this.firestore.collection<Message>(
      Col.GLOBAL_MESSAGES,
      ref => ref.orderBy('createdAt', 'desc').limit(50)
    ).valueChanges();
  }

  send(content: string) {
    return this.firestore.collection<Message>(Col.GLOBAL_MESSAGES).add({
      content,
      createdAt: Date.now(),
      createdBy: {
        ...this.userSrv.userSync,
        nanoAddress: this.walletSrv.address
      }
    });
  }


}
