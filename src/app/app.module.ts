import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { CountDown } from 'ng4-date-countdown-timer';

import { Web3Service } from './SubscriptionServices/web3.service';
import { SubscriptionProviders } from './SubscriptionServices/subscriptionProviders.service';
import { SmartContractService } from './SubscriptionServices/smartContract.service';
import { AccountsService } from './SubscriptionServices/accounts.service';
import { MatDialogModule } from '@angular/material';
import { WalletComponent } from './layout/wallet/wallet.component';
import { SubListComponent } from './layout/sub-list/sub-list.component';
import { SubCardComponent } from './layout/sub-list/sub-card/sub-card.component';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';
import { BaseComponent } from './base/base.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './layout/layout.component';
import { AddComponent } from './add/add.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { ActivityService } from './SubscriptionServices/activity.service';
import { ActivityComponent } from './layout/activity/activity.component';


@NgModule({
  declarations: [
    AppComponent,
    SubCardComponent,
    AddSubscriptionComponent,
    LayoutComponent,
    WalletComponent,
    SubListComponent,
    AddComponent,
    SubscribeComponent,
    BaseComponent,
    ActivityComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatDialogModule
  ],
  providers: [
    Web3Service,
    SubscriptionProviders,
    SmartContractService,
    AccountsService,
    ActivityService
  ],
  entryComponents: [AddSubscriptionComponent],
  bootstrap: [BaseComponent]
})
export class AppModule { }
