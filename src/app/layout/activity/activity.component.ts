import { Component, Input, NgZone, HostListener } from '@angular/core';
import { ActivityService } from '../../SubscriptionServices/activity.service';
import { Web3Service } from '../../SubscriptionServices/web3.service';



@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html'
})
export class ActivityComponent  {
  private activites: any = [];
  private _processing = false;
  private issuers: any;

  constructor(
    private _web3: Web3Service,
    private _activityService: ActivityService) {
      this._processing = true;

    }


  @HostListener('window:load')
  windowLoaded() {
    this._web3.getAccount()
    .then( (acc) => {
      this._activityService.get(acc)
      .then((activites) => {
        this.activites = activites;
        this._processing = false;
      });
    });
  }


}
