import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionComponent } from './subscription.component';
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";


@NgModule({
  declarations: [
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    UserNavbarComponent
  ]
})
export class SubscriptionModule { }
