import {Component, inject} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MainSearchComponent} from "../main-search.component";
import {NavbarChatCardComponent} from "../navbar-chat-card.component";
import {NotificationComponent} from "../notification.component";
import {NavbarTimeCardComponent} from "../navbar-time-card.component";
import {NavbarUserCardComponent} from "../navbar-user-card/navbar-user-card.component";
import {LanguageComponent} from "../language.component";
import {Router, RouterLink} from "@angular/router";
import {NotificationsComponent} from "../notifications/notifications.component";
import {DarkModeComponent} from "../dark-mode.component";
import {RolesService} from "../../services/roles.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationMessageComponent} from "../../dialogs/confirmation-message.component";
import {PageInfoComponent} from "../page-info/page-info.component";
import {PageInfoService} from "../../services/page-info.service";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'user-navbar',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslateModule, MainSearchComponent, NavbarChatCardComponent, NotificationComponent, NavbarTimeCardComponent, NavbarUserCardComponent, LanguageComponent, RouterLink, NotificationsComponent, DarkModeComponent , MatTooltipModule],
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss']
})
export class UserNavbarComponent {
  rolesSer = inject(RolesService);
  dialog = inject(MatDialog);
  router = inject(Router);
  pageInfoSer = inject(PageInfoService);
  isSuperAdmin = localStorage.getItem('is-super-admin')
  spaceName = localStorage.getItem('space-name')


  getInfo() {
    this.dialog.open(PageInfoComponent, {
      panelClass: 'large-dialog'
    })
  }


  logout() {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'small-dialog',
      data: {
        message: 'logout_message',
        btn_name: 'logout',
        classes: 'bg-primary white'
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let lang = localStorage.getItem('language') || 'en';
        localStorage.clear()
        localStorage.setItem('language', lang);
        this.router.navigate(['/auth/login'])
      }
    })
  }
}
