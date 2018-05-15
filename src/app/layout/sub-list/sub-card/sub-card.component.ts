import { Component, Input, NgZone } from '@angular/core';
import { SmartContractService } from '../../../SubscriptionServices/smartContract.service';
import { SubscriptionProviders } from '../../../SubscriptionServices/subscriptionProviders.service';

@Component({
  selector: 'app-sub-card',
  templateUrl: './sub-card.component.html'
})
export class SubCardComponent  {

  private _subscription;
  private _provider;
  private _issuer;
  private hello;
  private _waiting;
  constructor(
    private zone: NgZone,
    private _smartContractService: SmartContractService,
    private _subscriptionProvoders: SubscriptionProviders) { }


  @Input()
  set issuer(issuer: string) {
    console.log('setissuer', issuer);
    this._issuer = issuer;
    this._provider = this._subscriptionProvoders.getProvider(issuer);
    this.fetchSubscriptionInfo();
  }

  private  deactivate() {
    this._waiting = true;
    return this._smartContractService.deactivateSubscription(this._issuer)
    .then(() => {
      console.log('function returned!');
      setTimeout(() => {
        return this.fetchSubscriptionInfo();
      }, 10000);
    });
  }

  private  activate() {
    this._waiting = true;
    return this._smartContractService.activateSubscription(this._issuer)
    .then((result) => {
      console.log('activated', result);
      setTimeout(() => {
        return this.fetchSubscriptionInfo();
      }, 10000);
    });
  }

  private  fetchSubscriptionInfo() {
    return this._smartContractService.getSubscriptionInfo(this._issuer)
    .then( (val) => {
        this.zone.run(() => {
          console.log('fetched!');
          console.log(val);
          this._subscription = val;
          this._subscription.nextPayment = new Date(val.cycleStart + val.subscriptionTimeFrame);
          this._waiting = false;
          console.log("here we are!");
          this.hello = "here!"
        });
    });
  }

}
