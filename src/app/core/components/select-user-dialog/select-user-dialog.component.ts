import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {SearchComponent} from "../../filters/search.component";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {UserImageComponent} from "../user-image.component";
import {User} from "../../interfaces/user";
import {NotFoundComponent} from "../not-found.component";
import {LoadingComponent} from "../loading.component";
import {SelectUsersService} from "../../services/select-users.service";
import {BehaviorSubject} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import { DepartmentFilterComponent } from "../new-filters/departments-filter/departments-filter.component";
import { UsersFilterComponent } from "../new-filters/users-filter/users-filter.component";
import { PlacesFilterComponent } from "../new-filters/places-filter/places-filter.component";
import { JobTitlesFilterComponent } from "../new-filters/job-title-filter/job-title-filter.component";
import { LevelsFilterComponent } from "../new-filters/levels-filter/levels-filter.component";

@Component({
  selector: 'select-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SearchComponent,
    MatDialogModule,
    UserImageComponent,
    MatButtonModule,
    ArabicNumbersPipe,
    DepartmentFilterComponent,
    UsersFilterComponent,
    NotFoundComponent,
    LoadingComponent,
    PlacesFilterComponent,
    JobTitlesFilterComponent,
    LevelsFilterComponent
],
  templateUrl: './select-user-dialog.component.html',
  styles: [`
    .selected-users {
      overflow-x: auto;

      .selected-user {
        min-width: max-content;
      }
    }

    .table thead {
      top: -15px !important;
    }
  `]
})
export class SelectUserDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  users: any[] = [];
  loading = true;
  selectedUsers: any = [];
  selectedUsers$ = this.service.selectedUsers$;
  multi = true;
  page = 2;
  scrollTimeout: any;
  filterTimeout: any;
  totalUsers!: number;
  selectedDepartments: any = []
  selectedManagers: any[] | null= [];
  selectedPlaces: any[] | null= [];
  selectedLevels: any[] | null= [];
  selectedJobTitles: any[] | null= [];
  allSelected = false;
  isEdit = false;
  customSpaceId = localStorage.getItem('space-id')
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public service: SelectUsersService) {

    this.selectedUsers = this.data.selectedUsers;
    this.selectedDepartments = this.data?.selectedDepartments;
    this.selectedManagers = this.data?.selectedManagers;
    this.selectedPlaces = this.data?.selectedPlaces;
    this.selectedLevels = this.data?.selectedLevels;
    this.selectedJobTitles = this.data?.selectedJobTitles;
    this.multi = this.data.multi;
    this.isEdit = this.data.isEdit;
  }

  ngOnInit() {
    if (this.selectedUsers.length > 0) {
      this.service.getSelectedUsers(this.selectedUsers).subscribe();
    }
    this.getUsers();
    this.service.totalItems.subscribe(res => this.totalUsers = res);
    this.service.users.subscribe(res => {
      this.users = res;
      this.users.map(user => {
        this.selectedUsers?.find((selectedUser: any) => (selectedUser.id || selectedUser) == user.id) ? user.isSelected = true : user.isSelected = false;
      })
    });
  }

  ngAfterViewInit() {
    // for infinite scroll
    let content: HTMLElement = document.getElementById('select-user-content')!;
    content.addEventListener('scroll', () => {
      clearTimeout(this.scrollTimeout);
      let scrollTop = content.scrollTop;
      let scrollHeight = content.scrollHeight;
      if (scrollTop + 1500 >= scrollHeight && this.totalUsers > this.users.length) {
        this.scrollTimeout = setTimeout(() => {
          this.service.currentPage.next(this.page);
          this.service.getActiveUserProfiles(true).subscribe(() => {
            this.page++;
          })
        }, 700);
      }
    })
  }

  getSelectedDepartments($event: any) {
    this.selectedDepartments = $event;
  }

  getSelectedManagers($event: any) {
    this.selectedManagers = $event;
  }

  getSelectedPlaces($event: any) {
    this.selectedPlaces = $event;
  }

  getSelectedLevels($event: any) {
    this.selectedLevels = $event;
  }

  getSelectedJobTitles($event: any) {
    this.selectedJobTitles = $event;
  }


  selectUser(user: User) {
    if (!user.isSelected) {
      if (!this.multi) {
        this.clearSelection();
      }
      user.isSelected = true;
      this.selectedUsers = this.multi ? [...this.selectedUsers, user] : [user];
    } else {
      user.isSelected = false;
      if (!this.multi) {
        this.clearSelection();
      } else {
        this.unSelectUser(user);
      }
    }
    this.selectedUsers$.next(this.selectedUsers);
  }

  clearSelection() {
    this.selectedUsers = [];
    this.users.forEach(user => user.isSelected = false);
  }

  unSelectUser(user: any) {
    this.selectedUsers = this.selectedUsers.filter((selectedUser: any) => (selectedUser.id || selectedUser) !== (user.id || user));
    let deletable = this.users.find(_user => _user.id == user.id);
    if (deletable) {
      deletable.isSelected = false
    }
    this.selectedUsers$.next(this.selectedUsers);
  }

  getUsers() {
    this.loading = true;
    this.users = [];
    this.service.getActiveUserProfiles().subscribe(res => {
      this.loading = false;
    });
  }

  filter(value?: any, key?: BehaviorSubject<any>) {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.service.currentPage.next(1);
      this.page = 2
      key?.next(value);
      this.getUsers();
    }, 500);
  }

  ngOnDestroy() {
    this.service.reset();
  }
  selectAllUsers() {
    this.allSelected = !this.allSelected;

    if (this.allSelected) {
      // تحديد كل المستخدمين
      this.users.forEach(user => {
        if (!user.isSelected) {
          user.isSelected = true;
          if (!this.selectedUsers.find((selectedUser: any) => (selectedUser.id || selectedUser) === user.id)) {
            this.selectedUsers.push(user);
          }
        }
      });
    } else {
      // إلغاء تحديد الكل
      this.users.forEach(user => user.isSelected = false);
      this.selectedUsers = [];
    }

    // تحديث Observable الخاص بالمستخدمين المحددين
    this.selectedUsers$.next(this.selectedUsers);
  }

}
