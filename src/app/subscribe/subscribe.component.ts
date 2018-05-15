import { Component, Inject, HostListener } from '@angular/core';
import { SmartContractService } from '../SubscriptionServices/smartContract.service';
import { Web3Service } from '../SubscriptionServices/web3.service';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionProviders } from '../SubscriptionServices/subscriptionProviders.service';


@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html'
})
export class SubscribeComponent  {
  private _provider: any;
  private _processing = true;
  private _issuer;

  constructor(private _web3: Web3Service,
              private _activatedRoute: ActivatedRoute,
              private _providers: SubscriptionProviders,
              private _smartContractService: SmartContractService) {
    this._issuer = this._activatedRoute.snapshot.params.issuer;
    // setTimeout(() => {
    //   this._web3.connect();
    //   this._smartContractService.connect();
    //   this._provider = this._providers.getProvider(this._issuer);
    // }, 2000);

  }

  addSubscribtion() {
    this._processing = true;
    this._smartContractService.addSubscription(this._issuer, this._provider.timeframe, this._provider.amount)
    .then(() => {
      setTimeout(() => {
        window.location.href = '/o';
      }, 10000);
    });

  }

  @HostListener('window:load')
  windowLoaded() {
    this._web3.connect();
    this._smartContractService.connect();
    this._provider = this._providers.getProvider(this._issuer);
    this._smartContractService.getContractInastance().then( (contrat) => {
      console.log('smart Contract found?', contrat);
      return this._smartContractService.subscriptionIssuerExists(this._issuer);
    })
    .then((exists) => {
       console.log('we got the sub', exists);
       if (exists) {
         window.location.href = '/o/';
       } else {
         this._processing = false;
       }
    });
  }


}
