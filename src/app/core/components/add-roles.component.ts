import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MagicScrollDirective} from "../directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "./user-image.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {AlertService} from "../services/alert.service";
import {AllUsersService} from "../servicess/all-users.service";

@Component({
  selector: 'add-roles',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MagicScrollDirective, TranslateModule, UserImageComponent, MatCheckboxModule, FormsModule, MatButtonModule],
  template: `
    <h2 class="black"> {{'add_roles' | translate}}</h2>
    <div mat-dialog-content magicScroll="" class="pb-2 dir">
      <div class="flex aic flex-wrap gap-x-1 gap-y-2">
        <div *ngFor="let user of data.users; let i = index" class="ml-50 primary">
          <div class="flex aic">
            <user-image [img]="user.imageUrl"></user-image>
            <p class="ml-75">{{user.name}}</p>
          </div>
        </div>
      </div>



      <div class="flex aic mt-3">
        <mat-checkbox class="mr-1" [(ngModel)]="admin" color="primary"><span class="font-medium-2">{{'space_admin' | translate}}</span></mat-checkbox>
        <mat-checkbox class="mr-1" [(ngModel)]="limited" color="primary"><span class="font-medium-2">{{'limited_user' | translate}}</span></mat-checkbox>
        <mat-checkbox class="mr-1" [(ngModel)]="EmployeesKpi" color="primary"><span class="font-medium-2">{{'kpi_employee' | translate}}</span></mat-checkbox>
        <!-- <mat-checkbox class="mr-1" [(ngModel)]="KpiRater" color="primary"><span class="font-medium-2">{{'kpi_rater' | translate}}</span></mat-checkbox> -->
        <mat-checkbox class="mr-1" [(ngModel)]="KpiBankAdmin" color="primary"><span class="font-medium-2">{{'kpi_admin' | translate}}</span></mat-checkbox>
      </div>
    </div>
    <div class="dir" mat-dialog-actions align="end">
      <button mat-raised-button color="primary" class="mr-1" (click)="setRoles()" [disabled]="data.users.length == 0">{{'save' | translate}}</button>
      <button mat-raised-button mat-dialog-close="">{{'cancel' | translate}}</button>
    </div>

  `,
  styles: []
})
export class AddRolesComponent implements OnInit {
  admin = false;
  limited = false;
  EmployeesKpi = false
  KpiRater = false
  KpiBankAdmin = false
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: AllUsersService, private alert: AlertService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  setRoles() {
    const data = {
      profileIds: this.data.users.map((user: any) => user.id),
      roleNames: [
        this.limited && 'SpacelimitedUser',
        this.admin && 'SpaceAdmin',
        this.EmployeesKpi && 'EmployeesKpi',
        this.KpiRater && 'KpiRater',
        this.KpiBankAdmin && 'KpiBankAdmin'
      ].filter(Boolean),
      isAddedRole: true
    }
    this.service.addOrRemoveRole(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert("role_added");
        this.service.hasChanged.next(true);
        this.service.selectedUsersToAddRole.next([]);
      }
      this.dialog.closeAll()
    });
  }

}
