import {Component, inject} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MainSearchComponent} from "./main-search.component";
import {NavbarTimeCardComponent} from "./navbar-time-card.component";
import {NavbarUserCardComponent} from "./navbar-user-card/navbar-user-card.component";
import {NotificationComponent} from "./notification.component";
import {LanguageComponent} from "./language.component";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {ConfirmationMessageComponent} from "../dialogs/confirmation-message.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'welcome-navbar',
  standalone: true,
  imports: [CommonModule, MainSearchComponent, NavbarTimeCardComponent, NavbarUserCardComponent, NotificationComponent, LanguageComponent, MatButtonModule, TranslateModule, NgOptimizedImage],
  template: `
    <div class="user-navbar rounded-5 w-100 bg-white border flex aic jcsb p-2">
      <div class="img">
        <img src="assets/images/logo/logo.svg" alt="logo icon">
      </div>
      <div class="flex aic gap-x-2">
        <language/>
        <div class="img right" (click)="logout()">
          <img src="assets/images/icons/welcome-logout.svg" class="convert-image-color" alt="logout icon">
        </div>
      </div>
    </div>

  `,
  styles: []
})
export class WelcomeNavbarComponent {
  dialog = inject(MatDialog);
  router = inject(Router);

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
