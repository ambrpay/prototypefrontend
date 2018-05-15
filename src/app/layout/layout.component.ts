import { Component, Inject,HostListener } from '@angular/core';
import { Web3Service } from '../SubscriptionServices/web3.service';
import { SubscriptionProviders } from '../SubscriptionServices/subscriptionProviders.service';
import { SmartContractService } from '../SubscriptionServices/smartContract.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent  {

  constructor(private _web3: Web3Service,
    private _subscriptionProviders: SubscriptionProviders,
    private _smartContractService: SmartContractService) { }


  @HostListener('window:load')
  windowLoaded() {
    this._web3.connect();
    this._smartContractService.connect();
  }

}
