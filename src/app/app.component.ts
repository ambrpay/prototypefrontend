import { Router, ActivatedRoute, Params} from '@angular/router';
import { OnInit, Component, HostListener } from '@angular/core';
import { COMPILER_OPTIONS } from '@angular/core/src/linker/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Web3Service } from './SubscriptionServices/web3.service';
import { SubscriptionProviders } from './SubscriptionServices/subscriptionProviders.service';
import { SmartContractService } from './SubscriptionServices/smartContract.service';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  answer: string = '';
  answerDisplay: string = '';
  showSpinner: boolean = false;

  web3: any;
  account: any = 'hello';
  balance: any = 'balance';
  issuers: any;
  topUpAmount: any = 0;
  withdrawAmount: any = 0;
  _waiting: any = false;

  walletBalance: any;
  walletAddress: any;

  public addIssuser;

  constructor(private _web3: Web3Service,
              private _providers: SubscriptionProviders,
              private _smartContractService: SmartContractService,
              private _activatedRoute: ActivatedRoute,
              public dialog: MatDialog
            ) {
    this.addIssuser = this._activatedRoute.snapshot.params.issuer;
    console.log('issuer that I add!', this.addIssuser);
  }

  pay() {
    this._waiting = true;
    this._web3.pay(this.walletAddress, this.topUpAmount)
    .then(() => {
      this.topUpAmount = 0;
      this.reloadwithDelay();
    });
  }

  withdraw() {
    this._waiting = true;
    this._smartContractService.withdrawFunds(this.withdrawAmount)
    .then(() => {
      this.withdrawAmount = 0;
      this.reloadwithDelay();
    });
  }

  @HostListener('window:load')
  windowLoaded() {
    this._web3.connect();
    this.account = this._web3.getAccount()
    .then(acc => {
      this.account = acc;
    });
    this.reloadInfos();
    //this._smartContractService.getSubscriptionInfo();
  }

  reloadInfos() {
    this.fetchBalance();
    this._waiting = true;
    return this._smartContractService.connect().then(() => {
      this._waiting = false;
      console.log("getting subissuers");
      return this._smartContractService.getSubscriptionIssuers();
    })
    .then((issuers) => {
      this.loadModal();
      console.log('got issuers',issuers);
      this.issuers = issuers;
      return;
    }).then(() => {
      return this._smartContractService.getBalance();
    }).then((balance) => {
      this.walletBalance = balance;
      this.walletAddress =  this._smartContractService.getAddress();
      return;
    });
  }

  reloadwithDelay() {
    setTimeout(() => {
      this.reloadInfos()
      .then(() => {
        this._waiting = false;
      });
    }, 10000);
  }


  fetchBalance() {
    this._web3.getAccountBalance()
    .then((balance) => {
      // this._ngZone.run(() => {
        this.balance = balance;
      // });
    });
  }

  loadModal() {
    console.log('modal loader!', this.addIssuser);
    if (this.addIssuser) {
      console.log('modal loader!');
      this._waiting = true;
      console.log(this.addIssuser);
      const dialogRef = this.dialog.open(AddSubscriptionComponent, {
        width: '450px',
        data: { addIssuser: this.addIssuser }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('gotten close event');
        this.addIssuser = false;

        if (result === 'added') {

          this.reloadwithDelay();
        } else {
          this._waiting = false;
        }
      });
    }
  }

}
