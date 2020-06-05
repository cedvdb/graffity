import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlockInfo, AccountInfo, PendingResp } from './nano.interfaces';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class NanoRpcService {

  constructor(private http: HttpClient) {

  }

  process<T = any>(subtype: string, block: any): Observable<T> {
    return this.http.post<T>(environment.nanoApi.url, {
      action: 'process',
      json_block: 'true',
      subtype,
      block
    });
  }

  getAccountInfo(address: string) {
    return this.http.post<AccountInfo>(environment.nanoApi.url, { action: 'account_info', account: address });
  }

  getBlockInfo(hash: string) {
    return this.http.post<BlockInfo>(environment.nanoApi.url, { action: 'block_info', json_block: true, hash });
  }

  getPendingHashes(address: string) {
    return this.http.post<PendingResp>(environment.nanoApi.url, { action: 'pending', account: address }).pipe(
      map(pending => pending.blocks)
    );
  }
}
