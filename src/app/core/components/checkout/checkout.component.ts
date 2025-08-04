import {Component, computed, Input, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../user-image.component";
import {ServiceProvidersService} from "../../services/service-providers.service";
import {UserProfile} from "../../interfaces/user-profile";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [CommonModule, ArabicNumbersPipe, TranslateModule, UserImageComponent, ArabicNumbersPipe],
  template: `
      <div class="checkout">
          <div class="flex-column-center">
              <h2 class="fs-36 primary">{{selectedSessions.length * serviceProvider().sessionFees | arabicNumbers}} {{'egp' | translate}}</h2>
              <p class="mt-2 primary">{{'total_amount' | translate}}</p>

              <div class="box border-bottom border-right border-left rounded p-2 shadow w-100 mt-2">
                  <p class="mb-1 inline-block w-30 text-right">{{'to' | translate}}</p>
                  <div class="flex aic gap-x-1">
                      <user-image [imageUrl]="environment.publicImageUrl" [img]="serviceProvider().imageUrl"/>
                      <p>{{serviceProvider().name}}</p>
                  </div>
                  <p>{{serviceProvider().phoneNumber}}</p>
              </div>

              <div class="details border rounded w-100 mt-2">
                  <p class="bg-gray p-1 bold border-bottom">{{'details' | translate}}</p>
                  <div class="p-1">
                      <div class="flex aic jcsb mb-1">
                          <p>{{'item' | translate}}</p>
                          <p class="bold">{{'session' | translate}}</p>
                      </div>
                      <div class="flex aic jcsb mb-1">
                          <p>{{'quantity' | translate}}</p>
                          <p class="bold">{{selectedSessions.length | arabicNumbers}}</p>
                      </div>
                      <div class="flex aic jcsb mb-1">
                          <p>{{'cost' | translate}}</p>
                          <p class="bold">{{serviceProvider().sessionFees | arabicNumbers}} {{serviceProvider().currency.currencyCode | translate}}</p>
                      </div>
                  </div>
                  <div class="p-1 border-top">
                      <div class="flex aic jcsb mb-1">
                          <p>{{'fees' | translate}}</p>
                          <p class="bold">{{serviceProvider().sessionFees | arabicNumbers}} {{serviceProvider().currency.currencyCode | translate}}</p>
                      </div>
                      <div class="flex aic jcsb mb-1">
                          <p>{{'promocode' | translate}}</p>
                          <p class="bold">{{0 | arabicNumbers}} {{serviceProvider().currency.currencyCode | translate}}</p>
                      </div>
                      <div class="flex aic jcsb mb-1">
                          <p>{{'total_cost' | translate}}</p>
                          <p class="bold">{{selectedSessions.length * serviceProvider().sessionFees | arabicNumbers}} {{serviceProvider().currency.currencyCode | translate}}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `,
  styles: []
})
export class CheckoutComponent {
  @Input() selectedSessions: any[] = [];
  serviceProvider: Signal<UserProfile> = computed(() => this.providerSer.serviceProvider())

  constructor(private providerSer: ServiceProvidersService) {
  }

  protected readonly environment = environment;
}
