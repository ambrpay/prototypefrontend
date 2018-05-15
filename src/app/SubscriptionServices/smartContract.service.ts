import { Injectable, HostListener, EventEmitter  } from '@angular/core';
import * as contract from 'truffle-contract';
import * as SubscriptionWallet from '../../../build/contracts/SubscriptionWallet.json';
import { Web3Service } from './web3.service';
import { AccountsService } from './accounts.service';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';



@Injectable()
export class SmartContractService {

  private subContract;
  private subscriptiopnContractAddress;
  private instance;

  public connected = new EventEmitter<any>();


  constructor(private _web3Service: Web3Service, private _accountsService: AccountsService) {
  }


  connect() {
    const web3 = this._web3Service.getWeb3();
    this.subContract = contract(SubscriptionWallet);
    this.subContract.setProvider(web3.currentProvider);
    return this._web3Service.getAccount()
    .then((acc) => {
      return this._accountsService.get(acc)
      .then( (contractAddress) => {
        console.log('getting account info', contractAddress);
        if (contractAddress) {
          console.log('contractaddress', contractAddress);
          return this.fetchContractInstance(contractAddress);
        } else {
          return this.createContract();
        }
      });
    })
    .then((res) => {
      this.connected.emit('connected');
      return res;
    })
    ;
  }


  getContractInastance() {
    const web3 = this._web3Service.getWeb3();
    this.subContract = contract(SubscriptionWallet);
    this.subContract.setProvider(web3.currentProvider);
    if (this.instance) { return Promise.resolve(this.instance); }

    return this._web3Service.getAccount()
    .then((acc) => {
      return this._accountsService.get(acc);
    })
    .then( (contractAddress) => {
      if (contractAddress) {
        console.log('contractaddress', contractAddress);
        return this.fetchContractInstance(contractAddress);
      } else {
        Promise.resolve(null);
      }
    });
  }

  private fetchContractInstance(contractAddress: any) {
    return this.subContract.at(contractAddress)
    .then(instance => {
      this.instance = instance;
      return instance;
    });
  }

  public createSmartWallet() {
    const web3 = this._web3Service.getWeb3();
    this.subContract = contract(SubscriptionWallet);
    this.subContract.setProvider(web3.currentProvider);
    return this.createContract();
  }

  public createContract() {
    let account;
    return this._web3Service.getAccount()
    .then(acc => {
      account = acc;
      console.log(account, acc);
      console.log('we got the account creating smart contract now');
      return this._web3Service.createContractInstance(this.subContract, acc);
    })
    .then((i) => {
      console.log('created Contract instance');
      console.log(i);
      return this.subContract.at(i['address']);
    })
    .then(instance => {
      this.instance = instance;
      console.log(this.instance);
      console.log(account);
      console.log('adding account');
      return this._accountsService.add(account, instance.address);
    })
    .catch(err => { console.log('there was an error', err); });
  }

  public getSubscriptionInfo(issuer: string) {
    const o = {};
    const web3 = this._web3Service.getWeb3();
    console.log(issuer);
    return this.instance.getSubscrition.call(issuer)
    .then(values => {
        console.log(values);
        o['cycleStart'] = new Date(values[0] * 1000);
        o['subscriptionTimeFrame'] = values[1];
        o['maxAmount'] = this._web3Service.getWeb3().fromWei(values[2]);
        o['withdrawnAmount'] = values[3];
        o['approved'] = values[4];
        return o;
    });
  }


  public getSubscriptionIssuers() {
    console.log("getting subs");
    console.log(this.instance.address);
    return this.instance.getSubscriptionIssuers.call()
    .then(values => {
      console.log("gotten subs",values);
        return values;
    }).catch(err=>{console.log(err)});
  }

  public subscriptionIssuerExists(issuer: string) {
    return this.getSubscriptionIssuers().then(issuers => {
      for (let i = 0; i < issuers.length; i++) {
        if ( issuers[i] === issuer ) { return true; }
      }
      return false;
    });
  }

  public addSubscription(issuer: string, subscriptionTimeFrame: any, maxAmount: any) {
    console.log("trying to add sub");
    return this._web3Service.getAccount()
    .then((acc) => {
      const value = this._web3Service.getWeb3().toWei(maxAmount);
      console.log(issuer, subscriptionTimeFrame, value);
      return this.instance.addSubscription(issuer, subscriptionTimeFrame, value, {from: acc});
    });
  }

  public activateSubscription(issuer: string) {
    return this._web3Service.getAccount()
    .then((acc) => {
      return this.instance.activateSubscription(issuer,  {from: acc})
      .then((result) => {
        console.log('result', result);
        return result;
      });
    });
  }

  public deactivateSubscription(issuer: string) {
    console.log('deactivate!');
    return this._web3Service.getAccount()
    .then((acc) => {
      console.log('deactivate', issuer);
      return this.instance.deactivateSubscription(issuer,  {from: acc, gas: 1000000});
    });
  }

  public withdrawFunds(amount: any) {
    return this._web3Service.getAccount()
    .then((acc) => {
      const value = this._web3Service.getWeb3().toWei(amount);
      return this.instance.withdrawFunds(value,  {from: acc});

    });
  }

  public getBalance() {
      return this.instance.getBalance.call()
      .then(v => {
        const value = this._web3Service.getWeb3().fromWei(v);
        return value;
      });
  }

  public getAddress() {
    return this.instance.address;
  }

}

/*
  activateSubscription(address _issuer)
  deactivateSubscription(address _issuer)
  withdrawFunds(uint amount)
  getBalance()
*/
