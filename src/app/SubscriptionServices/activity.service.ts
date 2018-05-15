import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable()
export class ActivityService {

  constructor(private http: HttpClient) {}

  get(account: any) {
    return new Promise((resolve, reject) => {
     this.http.get('http://localhost:8080/api/activity/' + account)
     .subscribe((data) => {
        resolve(data);
      });
    });
  }

  add(account: any, text: any, img: any, amount: any) {
    const body = {
      text: text,
      img: img,
      amount: amount
    };
    return new Promise((resolve, reject) => {
      return this.http.post('http://localhost:8080/api/activity/' + account, body)
      .subscribe((data) => {
        resolve(true);
      });
    });
  }
}
