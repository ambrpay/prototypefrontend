import { Component, Input, NgZone } from '@angular/core';
import { Web3Service } from '../../SubscriptionServices/web3.service';
import { SmartContractService } from '../../SubscriptionServices/smartContract.service';


@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html'
})
export class SubListComponent  {

  private _processing = false;
  private issuers: any;

  constructor(
    private _web3: Web3Service,
    private _smartContractService: SmartContractService) {
    this._processing = true;
    _smartContractService.connected.subscribe( (data: any) => {
      this.reloadInfos()
      .then(() => {
        this._processing = false;
      });
    });
  }


  reloadInfos() {
    return this._smartContractService.getSubscriptionIssuers()
    .then((issuers) => {
        console.log('got issuers', issuers);
        this.issuers = issuers;
        return;
      });

  }



}
