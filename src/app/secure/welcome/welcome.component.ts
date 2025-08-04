import {Component, inject} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MainSidebarComponent} from "../../core/components/main-sidebar.component";
import {RouterOutlet} from "@angular/router";
import {WelcomeNavbarComponent} from "../../core/components/welcome-navbar.component";
import {LayoutComponent} from "../../core/components/layout.component";
import {TranslateModule} from "@ngx-translate/core";
import {Space} from "../../core/interfaces/space";
import {SpacesService} from "../../core/services/spaces.service";
import {UserService} from "../../core/services/user.service";
import {JoinSpaceComponent} from "../../core/components/join-space.component";
import {MatDialog} from "@angular/material/dialog";
import {NavbarTimeCardComponent} from "../../core/components/navbar-time-card.component";
import {Observable, tap} from "rxjs";
import {UserImageComponent} from "../../core/components/user-image.component";
import {MagicScrollDirective} from "../../core/directives/magic-scroll.directive";
import {SubscriptionService} from "../../core/services/subscription.service";
import {ManageSubscriptionComponent} from "../../core/components/manage-subscription/manage-subscription.component";
import {OrderDetailsDialogComponent} from "../../core/components/order-details-dialog/order-details-dialog.component";
import {AlertService} from "../../core/services/alert.service";
import {RolesService} from "../../core/services/roles.service";
import { LoadingComponent } from "../../core/components/loading.component";
import { IsCurrentSpaceService } from 'src/app/core/services/is-current-space.service';

@Component({
  selector: 'welcome',
  standalone: true,
  imports: [CommonModule, MainSidebarComponent, RouterOutlet, WelcomeNavbarComponent, LayoutComponent, NgOptimizedImage, TranslateModule, NavbarTimeCardComponent, UserImageComponent, MagicScrollDirective, LoadingComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  service = inject(SpacesService);
  userSer = inject(UserService);
  rolesSer = inject(RolesService);
  subscriptionSer = inject(SubscriptionService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  spaces$: Observable<Space[]>;
  loading: boolean = false;
  currentSpace: any;
  constructor(private iscur:IsCurrentSpaceService){}
  ngOnInit(){
    console.log()
    this.iscur.getMySpaces().subscribe((res:any) => {
      console.log(res)
    })
    this.loading = true
    this.spaces$ = this.service.getSpaces().pipe(
      tap(spaces => {
        this.currentSpace = spaces.find((item: any) => item.isCurrent === true);

        if (this.currentSpace && !this.currentSpace.isCurrent) {
          this.handelSpace(this.currentSpace);
        } else {
          this.loading = false;
        }
      })
    );


  }
  handelSpace(space: any) {
    localStorage.setItem('space-id', space.spaceId);
    localStorage.setItem('base-url', space.baseUrl);
    localStorage.setItem('chat-id', space.chatId);
    this.service.switchSpace(space.spaceId).subscribe((res: any) => {
      // if the space is switched successfully and there is no payment required
      if (res.success) {
        this.userSer.getMyProfile(space.spaceId, space.baseUrl).subscribe((res: any) => {
          // if there is no errors in the user profile then redirect to the dashboard
          if (res.success) {
            window.location.href = '/';
          }
        })
        //   if there is payment required
      } else if (res.code == 9954) {
        this.rolesSer.getRoles().subscribe((res: any) => {
          if (res.success) {
            if (this.rolesSer.canAccessAdmin.value) {
              //   check if there is an order to pay
              this.subscriptionSer.getUnpaidOrders().subscribe((res => {
                if (res.length == 0) {
                  this.dialog.open(ManageSubscriptionComponent, {
                    panelClass: 'manage-subscription-dialog',
                    data: {
                      changePackage: true
                    }
                  })
                } else {
                  this.dialog.open(OrderDetailsDialogComponent, {
                    panelClass: 'order-details-dialog',
                    data: {
                      order: res[0].id,
                      welcome: true
                    }
                  })
                }
              }))
            } else {
              this.alert.showAlert('contact_admin', 'bg-danger', 5000)
            }
          }
        });
      }
    })
  }

  createSpace() {

  }

  joinSpace() {
    this.dialog.open(JoinSpaceComponent, {
      panelClass: 'small-dialog'
    })
  }

}
