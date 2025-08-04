import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {BehaviorSubject} from "rxjs";
import {User} from "../../interfaces/user";
import {UserImageComponent} from "../user-image.component";
import {TranslateModule} from "@ngx-translate/core";
import {MagicScrollDirective} from "../../directives/magic-scroll.directive";
import {SpaceListComponent} from "../space-list.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationMessageComponent} from "../../dialogs/confirmation-message.component";
import {Router, RouterLink} from "@angular/router";
import {JoinSpaceComponent} from "../join-space.component";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {AlertService} from "../../services/alert.service";
import {ReportProblemComponent} from "../report-problem/report-problem.component";

@Component({
  selector: 'user-card',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, UserImageComponent, TranslateModule, MagicScrollDirective, SpaceListComponent, RouterLink, ClipboardModule],
  templateUrl: './navbar-user-card.component.html',
  styleUrls: ['./navbar-user-card.component.scss']
})
export class NavbarUserCardComponent {
  userService = inject(UserService);
  user$: BehaviorSubject<User> = this.userService.user$;
  dialog = inject(MatDialog);
  router = inject(Router);
  alert = inject(AlertService);

  joinSpace() {
    this.dialog.open(JoinSpaceComponent, {
      panelClass: 'small-dialog'
    })
  }

  copy() {
    this.alert.showAlert('copied');
  }

  raiseIssue(menu?: any) {
    menu.closeMenu()

    this.dialog.open(ReportProblemComponent, {
      width: '600px',
      panelClass: "raise-issue-dialog"
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
        let mode = localStorage.getItem('mode') || 'light';
        localStorage.clear()
        localStorage.setItem('language', lang);
        localStorage.setItem('mode', mode);
        this.router.navigate(['/auth/login'])
      }
    })
  }
}
