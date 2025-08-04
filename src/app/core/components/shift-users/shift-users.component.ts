import {Component, Inject, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShiftsService} from "../../services/shifts.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {LoadingComponent} from "../loading.component";
import {NotFoundComponent} from "../not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../user-image.component";
import {MatButtonModule} from "@angular/material/button";
import {SelectUserDialogComponent} from "../select-user-dialog/select-user-dialog.component";
import {AlertService} from "../../services/alert.service";
import {ConfirmationMessageComponent} from "../../dialogs/confirmation-message.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'shift-users',
  standalone: true,
  imports: [CommonModule, LoadingComponent, MatDialogModule, NotFoundComponent, TranslateModule, UserImageComponent, MatButtonModule , FormsModule],
  templateUrl: './shift-users.component.html',
  styleUrls: ['./shift-users.component.scss']
})
export class ShiftUsersComponent implements OnInit {
  service = inject(ShiftsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  users: any = [];
  originalUsers: any = []; // Store original users
  loading = false;
  searchQuery: string = ''; // Add search query field

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
  // Method to filter users based on search query
  filterUsers() {
    const searchTerm = this.searchQuery.toLowerCase().trim();
    console.log(searchTerm);

    if (searchTerm === '') {
      this.users = [...this.originalUsers]; // Reset users list
    } else {
      this.users = this.originalUsers.filter((user: any) =>
        (user.name?.toLowerCase().includes(searchTerm) || user.jobTitle?.toLowerCase().includes(searchTerm))
      );
    }
  }

  ngOnInit() {
    this.getUsers()
  }

  addUsers() {
    let dialogRef = this.dialog.open(SelectUserDialogComponent, {
      panelClass: 'select-users-dialog',
      data: {
        selectedUsers: [],
        selectedDepartments: [],
        multi: true,
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res?.changed && (res.users?.length != 0 || res.selectedDepartments?.length != 0)) {
        let data = {
          ...(res.user?.length != 0 && {usersId: res.users?.map((user: any) => user.id)}),
          ...(res.selectedDepartments?.length != 0 && {departments: res.selectedDepartments}),
          shiftId: this.data.id
        }

        this.service.addUsersToShift(data).subscribe((res: any) => {
          if (res.success) {
            this.getUsers();
            this.alert.showAlert('users_added_to_shift')
          }
        })

      }
    })
  }

  removeUser(id: any) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'remove_user',
        btn_name: 'confirm',
        classes: 'bg-danger white'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.removeUserFromShift(this.data.id, id).subscribe((res: any) => {
          if (res.success) {
            this.getUsers();
            this.alert.showAlert('user_removed')
          }
        })
      }
    })
  }

  getUsers() {
    this.loading = true;
    this.service.getUsers(this.data.id).subscribe((res: any) => {
      this.users = res.data;
      this.originalUsers = res.data;
      this.loading = false;
    })
  }
}
