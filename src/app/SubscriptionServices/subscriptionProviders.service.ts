import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SubscriptionProviders {
  providers: any;

  dummy = {
    address: '**',
    name: '***',
    subscriptionName: '***',
    amount: 0,
    timeframe: 0,
    picture: '**',
  };

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:8080/api/getProviders')
    .subscribe( (res) => {
      this.providers = res;
    });
  }

  getProvider(provider: string) {
    console.log('provider', provider);
    console.log(this.providers);
    const found = this.providers[provider];
    if(!found) return
    console.log('found', found);
    return found;
  }

}
