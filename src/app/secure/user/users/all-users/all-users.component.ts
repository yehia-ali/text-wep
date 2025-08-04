import {Component, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {AllUsersFilterComponent} from "./all-users-filter/all-users-filter.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import * as XLSX from "xlsx";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../../core/services/user.service";
import {AllUser} from "../../../../core/interfaces/all-user";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {AllUsersService} from "../../../../core/servicess/all-users.service";
import {AlertService} from "../../../../core/services/alert.service";
import {EditUserComponent} from 'src/app/core/components/edit-user/edit-user.component';
import {RolesService} from "../../../../core/services/roles.service";

@Component({
  selector: 'all-users',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, AllUsersFilterComponent, MatCheckboxModule, TranslateModule, NgxPaginationModule, UserImageComponent, ArabicDatePipe, NotFoundComponent, LoadingComponent],
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {
  users: AllUser[] = [];
  meta: any;
  loading = false;
  spaceAdmin!: boolean
  allChecked = false;
  selectedUsers: any = [];
  selectedUsersToAddRole = [];

  constructor(public service: AllUsersService, private dialog: MatDialog, public rolesSer: RolesService, private elm: ElementRef, private alert: AlertService) {
  }

  ngOnInit(): void {
    this.service.selectedUsersToAddRole.subscribe(res => this.selectedUsersToAddRole = res);
    this.rolesSer.isAdmin.subscribe(res => this.spaceAdmin = res)
    this.service.meta.subscribe(res => this.meta = res);
    this.service.users$.subscribe(res => {
      this.users = res;
      this.checkAllCheckedUsers();
    });
    this.service.loading.subscribe(res => this.loading = res);
    if (this.users.length == 0) {
      this.service.search.next('');
    }
  }

  getUsers() {
    this.service.hasChanged.next(true);
  }

  selectAllUsers($event: any) {
    this.allChecked = true;
    this.users.forEach(user => {
      this.selectUser($event, user)
    })
  }

  selectUser($event: any, user: any) {
    if ($event.checked) {
      user.isSelected = true;
      this.getSelectedUsers()

    } else {
      this.allChecked = false;
      this.removeSelectedUser(user);
      user.isSelected = false;
    }
    this.checkAllCheckedUsers();
  }


  getSelectedUsers() {
    this.selectedUsers = this.users.filter((user: any) => {
      return user.isSelected
    });
    let arr: any = [];
    this.selectedUsers = this.selectedUsers.filter((user: any) => {
      return !this.selectedUsersToAddRole.find((_user: any) => user.id == _user.id);
    });
    this.service.selectedUsersToAddRole.next(arr.concat(this.selectedUsersToAddRole, this.selectedUsers));
  }

  removeSelectedUser(user: any) {
    let newArr = this.selectedUsersToAddRole.filter((_user: any) => {
      return user.id != _user.id
    });
    this.service.selectedUsersToAddRole.next(newArr);
  }

  checkAllCheckedUsers() {
    let selectedLength = 0
    this.users.forEach((user: any) => {
      if (user.isSelected) {
        selectedLength++;
      }
    });
    this.allChecked = selectedLength == this.users.length;
  }

  editUser(user: AllUser) {
    let isSuperAdmin = false;
    user.profileRoles.forEach(res => {
      if (res.roleName == 'SpaceSuperAdmin') {
        isSuperAdmin = true;
      }
    });
    this.dialog.open(EditUserComponent, {
      panelClass: 'w-90v',
      data: {
        user,
        isSuperAdmin
      },
    });
  }

  removeRole(user: AllUser, roleName: string) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_role',
        btn_name: "confirm",
        classes: 'w-100 bg-primary white',
        user,
        roleName
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const data = {
          profileIds: [user.id],
          roleNames: [roleName],
          isAddedRole: false
        }
        this.service.addOrRemoveRole(data).subscribe((_res: any) => {
          if (_res.success) {
            this.alert.showAlert('role_removed')
            this.service.hasChanged.next(true);
          }
        })
      }
    })
  }

  pageChanged(e: any) {
    this.service.page.next(e)
    this.getUsers();
  }

  limitChanged(e: any) {
    this.service.page.next(1);
    this.service.limit.next(e);
    this.getUsers();
  }

  exportToExcel() {
    /* pass here the table id */
    let element = this.elm.nativeElement.querySelector('#users');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'users.xlsx');
  }


  trackBy(index: any, item: any) {
    return item.id;
  }
}
