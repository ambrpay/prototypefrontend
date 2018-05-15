import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable()
export class AccountsService {

  constructor(private http: HttpClient) {}

  get(account: any) {
    return new Promise((resolve, reject) => {
     this.http.get('http://localhost:8080/api/getCustomer/' + account)
     .subscribe((data) => {
       if (data['contractId']) {
        resolve(data['contractId']);
       } else {
         resolve(undefined);
       }
      });
    });
  }

  add(account: any, address: any) {
    const body = JSON.stringify({contractId: address});
    console.log('added account', account, address);
    return new Promise((resolve, reject) => {
      return this.http.get('http://localhost:8080/api/addCustomer/' + account + '/' + address)
      .subscribe((data) => {
        resolve(true);
      });
    });
  }
}
