import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class NatriconService {

  addresses = new Map<string, string>();

  constructor(private http: HttpClient) {

  }

  getIcon(address: string): Observable<string> {
    if (this.addresses.has(address)) {
      return of(this.addresses.get(address));
    } else {
      return this.http.get<string>('https://natricon.com/api/v1/nano?address=' + address, {
        headers: {
          responseType: 'text'
        }
      })
      .pipe();
    }
  }
}
