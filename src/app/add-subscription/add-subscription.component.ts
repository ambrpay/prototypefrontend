import { Component, Inject, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AppComponent } from '../app.component';
import { SmartContractService } from '../SubscriptionServices/smartContract.service';
import { SubscriptionProviders } from '../SubscriptionServices/subscriptionProviders.service';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html'
})
export class AddSubscriptionComponent  {
  private _addIssuer;
  private _subscription;
  private _provider;

  constructor(
    public dialogRef: MatDialogRef<AppComponent>,
    private _smartContractService: SmartContractService,
    private _subscriptionProvoders: SubscriptionProviders,
    private zone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this._addIssuer = data.addIssuser;
      this._provider = this._subscriptionProvoders.getProvider(this._addIssuer);
    }

  accept(): void {
    this.addSubscription();
  }

  decline(): void {
    this.dialogRef.close();
  }

  addSubscription() {
    this._smartContractService.addSubscription(
      this._addIssuer,
      this._provider.timeframe,
      this._provider.amount
    ).then(() => {
      this.dialogRef.close('added');
    });
  }

}
