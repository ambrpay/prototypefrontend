import { Component, Input, NgZone } from '@angular/core';
import { Web3Service } from '../../SubscriptionServices/web3.service';
import { SubscriptionProviders } from '../../SubscriptionServices/subscriptionProviders.service';
import { SmartContractService } from '../../SubscriptionServices/smartContract.service';
import { ActivityService } from '../../SubscriptionServices/activity.service';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html'
})
export class WalletComponent  {
  private walletBalance: any;
  private walletAddress: any;

  private _processing = false;
  private amount: any;
  private _show  = '';

  constructor(
    private _web3: Web3Service,
    private _smartContractService: SmartContractService,
    private _actvityService: ActivityService) {
    this._processing = true;
    _smartContractService.connected.subscribe( (data: any) => {
      this.reloadInfos()
      .then(() => {
        this._processing = false;
      });
    });
  }

  add() {
    this._processing = true;
    this._web3.pay(this.walletAddress, this.amount)
    .then(() => {
      this._web3.getAccount()
      .then((acc) => {
         this._actvityService.add(acc, 'You added funds', 'fa-upload', this.amount);
         this.amount = 0;
      });
      this._show = '';
      this.reloadwithDelay();
    });
  }

  withdraw() {
    this._processing = true;
    this._smartContractService.withdrawFunds(this.amount)
    .then(() => {
      this._web3.getAccount()
      .then((acc) => {
        this._actvityService.add(acc, 'You withdrew funds', 'fa-download', this.amount);
        this.amount = 0;
      });
      this._show = '';
      this.reloadwithDelay();
    });
  }


  private setShow(str) {
    if (this._show === str) {
        this._show = '';
    } else {
      this._show = str;
    }

  }

  private show(str) {
    return this._show === str;
  }


  reloadInfos() {
    this._processing = true;
    this.walletAddress =  this._smartContractService.getAddress();
    return this._smartContractService.getBalance()
    .then((balance) => {
      this.walletBalance = balance;
      return;
    });
  }

  reloadwithDelay() {
    setTimeout(() => {
      window.location.href = '/o';
    }, 10000);
  }
}
