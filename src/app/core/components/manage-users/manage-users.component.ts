import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {User} from "../../interfaces/user";
import {AlertService} from "../../services/alert.service";
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {UserImageComponent} from "../user-image.component";
import {MatButtonModule} from "@angular/material/button";
import {AllUsersService} from "../../servicess/all-users.service";
import {ManageUsersService} from '../../services/manage-users.service';

@Component({
  selector: 'manage-users',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, ArabicNumbersPipe, UserImageComponent, MatButtonModule],
  template: `
    <div class="manage-users" [dir]="dir">
      <div class="pb-1">
        <h2 class="mb-1">{{ 'manage_users' | translate }}</h2>
        <div class="flex aic jcsb border-top pt-2 fs-16 px-2">
          <p>{{ 'active_users_number' | translate }}: {{ _activeUsers | arabicNumbers }}</p>
          <p>{{ 'inactive_users_number' | translate }}: {{ _inactiveUsers | arabicNumbers }}</p>
        </div>
      </div>
      <div mat-dialog-content id="manage-user-content">
        <div class="flex aic jcsb mb-2" *ngFor="let user of users">
          <div class="user">
            <div class="user-info flex aic gap-x-1">
              <user-image [img]="user.imageUrl"></user-image>
              <div class="user-data">
                <p>{{ user.name }}</p>
                <p class="muted fs-13">{{ user.jobTitle }}</p>
              </div>
            </div>
          </div>
          <!--   cant take action on themselves or the space super admin   -->
          <div class="action" *ngIf="(user.profileRoles && user.profileRoles[0]?.roleName != 'SpaceSuperAdmin' && currentUser != user.id) || user.profileRoles.length == 0">
            <button mat-raised-button color="primary" (click)="activateAccount(false, user)" *ngIf="user.isActivated">{{ 'deactivate' | translate }}</button>
            <button mat-raised-button color="warn" *ngIf="!user.isActivated" (click)="activateAccount(true, user)">{{ 'activate' | translate }}</button>
          </div>
        </div>
      </div>
      <div mat-dialog-actions align="end">
        <div class="flex gap-x-1">
          <button mat-raised-button [mat-dialog-close]="_activeUsers" class="px-4">{{ 'close' | translate }}</button>
          <button mat-raised-button color="primary" [mat-dialog-close]="_activeUsers" class="px-4">{{ 'save' | translate }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .action {
      button {
        min-width: 15rem;
      }
    }
  `]
})
export class ManageUsersComponent implements OnInit, AfterViewInit {
  scrollTimeout: any;
  totalUsers!: number;
  page = 2;
  users: User[] = [];
  dir: any;
  _activeUsers: number = 0;
  _inactiveUsers: number = 0;
  currentUser = JSON.parse(localStorage.getItem('id')!)

  constructor(private service: ManageUsersService, private allUsersSer: AllUsersService, private alert: AlertService) {
  }


  ngOnInit(): void {
    this.dir = document.dir
    this.service.totalItems.subscribe((res: any) => this.totalUsers = res);
    this.service.users.subscribe((res: any) => this.users = res);
    this.service.activeUsers.subscribe((res: any) => this._activeUsers = res);
    this.service.inactiveUsers.subscribe((res: any) => this._inactiveUsers = res);
    this.getUsers();
  }

  ngAfterViewInit() {
    let content: HTMLElement = document.getElementById('manage-user-content')!;
    content.addEventListener('scroll', () => {
      clearTimeout(this.scrollTimeout);
      let scrollTop = content.scrollTop;
      let scrollHeight = content.scrollHeight;
      if (scrollTop + 1500 >= scrollHeight && this.totalUsers > this.users.length) {
        this.scrollTimeout = setTimeout(() => {
          this.service.currentPage.next(this.page);
          this.getUsers()
          this.page++;
        }, 700);
      }
    })
  }

  activateAccount(active: boolean, user: User) {
    this._activeUsers = active ? this._activeUsers + 1 : this._activeUsers - 1;
    this._inactiveUsers = active ? this._inactiveUsers - 1 : this._inactiveUsers + 1;
    const data = {
      id: user.id,
      isActivated: active
    }
    this.allUsersSer.activateAccount(data).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('user_status_changed')
          user.isActivated = active
        }
      }
    )
  }

  getUsers() {
    this.service.getActiveUserProfiles().subscribe()
  }
}
