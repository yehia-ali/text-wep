import {AfterViewInit, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MagicScrollDirective} from 'src/app/core/directives/magic-scroll.directive';
import {TranslateModule} from '@ngx-translate/core';
import {UserProfile} from 'src/app/core/interfaces/user-profile';
import {MatDialog} from '@angular/material/dialog';
import {VerifiedComponent} from "../../../../../core/components/verified.component";
import {ArabicNumbersPipe} from "../../../../../core/pipes/arabic-numbers.pipe";
import {RateComponent} from "../../../../../core/components/rate.component";
import { BookSessionComponent } from 'src/app/core/components/book-session/book-session.component';

@Component({
  selector: 'user-profile-side-menu',
  standalone: true,
  template: `
    <div class="side-menu border-right bg-gray text-center pb-2" magicScroll="" id="user-profile-sidebar">
      <div class="flex-center user-info gap-x-1 px-2">
        <p class="bold fs-17">{{userProfile.name}}</p>
        <verified *ngIf="userProfile.verified"/>
      </div>
      <p class="my-50" *ngIf="isCurrentUser">{{userProfile.phoneNumber}}</p>
      <p class="my-50 px-2">{{userProfile.jobTitle}}</p>
      <p class="category bg-light-primary-10 rounded inline-block py-25 px-50 fs-15"
         *ngIf="userProfile.serviceSubCategory">{{language == 'en' ? userProfile.serviceSubCategory.serviceCategory.enName : userProfile.serviceSubCategory.serviceCategory.arName}}</p>
      <div class="work px-3 mt-1 bold">
        <!-- <div class="flex aic gap-x-1">
            <div class="img">
                <img src="assets/images/icons/bag.svg" alt="bag icon">
            </div>
            <p class="fs-14">{{'1 Year'}}</p>
        </div> -->
        <div class="flex aic gap-x-1 mt-2 mb-1" *ngIf="userProfile.sessionDuration && userProfile.currency">
          <div class="img">
            <img src="assets/images/icons/money.svg" alt="money icon">
          </div>
          <p class="fs-16">
            <span>{{userProfile.sessionDuration | arabicNumbers}}</span>
            <span class="ml-25">{{'minute' | translate}}</span>
            <span> / </span>
            <span>{{userProfile.sessionFees | arabicNumbers}}</span>
            <span class="ml-25">{{userProfile.currency.currencyCode || 'EGP' | translate}}</span>

          </p>
        </div>
        <rate [rate]="userProfile.rate" type="small"></rate>
      </div>
      <div class="actions w-100 px-3 mt-5" *ngIf="!isCurrentUser">
        <button mat-raised-button color="primary" class="w-100 rounded" (click)="bookNow()">{{'book_now' | translate}}</button>
        <!-- <button class="border-primary clickable-btn w-100 mt-2 bg-white primary pt-75 pb-75 rounded pointer">{{'send_message' | translate}}</button> -->
      </div>
    </div>
  `,
  styles: [`
    .side-menu {
      width: 320px;
      height: 100%;

      .user-info {
        margin-top: 10rem;
      }
    }

  `],
  imports: [CommonModule, VerifiedComponent, MatButtonModule, MagicScrollDirective, TranslateModule, RateComponent, VerifiedComponent, ArabicNumbersPipe, RateComponent]
})
export class UserProfileSideMenuComponent implements AfterViewInit {
  @Input() userProfile!: UserProfile;
  @Input() isCurrentUser = true;
  language = localStorage.getItem('language') || 'en'

  constructor(private dialog: MatDialog) {
  }

  bookNow() {
    this.dialog.open(BookSessionComponent, {
      panelClass: 'book-session-dialog',
      disableClose: true,
      data: {
        user: this.userProfile,
        id: this.userProfile.id,
        fees: this.userProfile.sessionFees,
        currency: this.userProfile.currency?.currencyCode || 'EGP',
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let sideMenu = document.getElementById('user-profile-sidebar')!;
      let userProfileContent = document.getElementById('user-profile-content')!;
      let userProfile = document.getElementById('user-profile')!;

      let obs = new ResizeObserver(() => {
        if ((userProfile.offsetHeight - 160) > userProfileContent.offsetHeight) {
          sideMenu.style.height = userProfile.offsetHeight - 160 + 'px';
        } else {
          sideMenu.style.height = userProfileContent.offsetHeight + 'px';
        }
      });
      obs.observe(userProfileContent);
    }, 10);
  }
}
