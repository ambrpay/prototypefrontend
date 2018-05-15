import { Component, Inject, HostListener } from '@angular/core';
import { SmartContractService } from '../SubscriptionServices/smartContract.service';
import { Web3Service } from '../SubscriptionServices/web3.service';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionProviders } from '../SubscriptionServices/subscriptionProviders.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent  {
  private _provider: any;
  private _processing = true;
  private _issuer;

  constructor(private _web3: Web3Service,
              private _activatedRoute: ActivatedRoute,
              private _providers: SubscriptionProviders,
              private _smartContractService: SmartContractService) {
    this._issuer = this._activatedRoute.snapshot.params.issuer;
  }

  createSmartContract() {
    this._processing = true;
    this._smartContractService.createSmartWallet()
    .then(() => {
      window.location.href = '/add/' + this._issuer;
    });
  }


  @HostListener('window:load')
  windowLoaded() {
    this._web3.connect();
    this._provider = this._providers.getProvider(this._issuer);
    this._smartContractService.getContractInastance().then( (o) => {
      console.log('smart Contract found?',o);
      if (o) {
        window.location.href = '/add/' + this._issuer;
      } else {
        this._processing = false;
      }
    });
  }

}
