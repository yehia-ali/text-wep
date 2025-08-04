import { SelectedUser } from './../interfaces/selected-user';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { ArabicNumbersPipe } from "../pipes/arabic-numbers.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { SelectUserDialogComponent } from "./select-user-dialog/select-user-dialog.component";
import { SelectUsersService } from "../services/select-users.service";
import { GlobalService } from "../services/global.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'select-user',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicNumbersPipe, MatButtonModule],
  template: `
      <button mat-raised-button class="{{classes}} {{newFilter? 'new-filter':''}}" color="primary" (click)="openDialog()">
          <span class="line-height" *ngIf="!selectedUsers.length">{{ text | translate }}</span>
          <span class="bg-gray line-height rounded-5 px-50 dark ml-25 flex-inline aic jcc" *ngIf="selectedUsers.length > 0 && newFilter">
            {{ selectedUsers.length | arabicNumbers }}
          </span>
          <span class="white px-50 dark ml-25" *ngIf="selectedUsers.length > 0 && !multi">
                {{ selectedUsers[0]?.name }}
              </span>
            
          <ng-container *ngIf="!newFilter && multi">
            <span *ngIf="selectedUsers.length > 0 && !chat && (selectedDepartmentsNames.value.length == 0 || selectedManagersNames.value.length == 0 || selectedPlacesNames.value.length == 0 || selectedLevelsNames.value.length == 0|| selectedJobTitlesNames.value.length == 0)">:
              <span *ngIf="selectedUsers[0]?.name.length >= 9">{{ selectedUsers[0]?.name | slice:0:9 }}...</span>
              <span *ngIf="selectedUsers[0]?.name.length < 9">{{ selectedUsers[0]?.name }}</span>
              <span class="bg-gray line-height rounded px-50 dark ml-25" *ngIf="selectedUsers.length > 1">
                +{{ selectedUsers.length - 1 | arabicNumbers }}
              </span>
            </span>
            <span *ngIf="!chat && selectedDepartmentsNames.value.length > 0">:
              <span *ngIf="selectedDepartmentsNames.value[0]?.name.length >= 9">
                {{ selectedDepartmentsNames.value[0]?.name | slice:0:9 }}...
              </span>
              <span *ngIf="selectedDepartmentsNames.value[0]?.name.length < 9">
                {{ selectedDepartmentsNames.value[0]?.name }}
              </span>
              <span class="bg-gray line-height rounded px-50 dark ml-25" *ngIf="selectedDepartmentsNames.value.length > 1">
                +{{ (selectedDepartmentsNames.value.length + selectedUsers.length) - 1 | arabicNumbers }}
              </span>
            </span>

            <span *ngIf="!chat && selectedManagersNames.value.length > 0">:
              <span *ngIf="selectedManagersNames.value[0]?.name.length >= 9">
                {{ selectedManagersNames.value[0]?.name | slice:0:9 }}...
              </span>
              <span *ngIf="selectedManagersNames.value[0]?.name.length < 9">
                {{ selectedManagersNames.value[0]?.name }}
              </span>
              <span class="bg-gray line-height rounded px-50 dark ml-25" *ngIf="selectedManagersNames.value.length > 1">
                +{{ (selectedManagersNames.value.length + selectedUsers.length) - 1 | arabicNumbers }}
              </span>
            </span>

            <span *ngIf="!chat && selectedPlacesNames.value.length > 0">:
              <span *ngIf="selectedPlacesNames.value[0]?.nameAr.length >= 9">
                {{ selectedPlacesNames.value[0]?.nameAr | slice:0:9 }}...
              </span>
              <span *ngIf="selectedPlacesNames.value[0]?.nameAr.length < 9">
                {{ selectedPlacesNames.value[0]?.nameAr }}
              </span>
              <span class="bg-gray line-height rounded px-50 dark ml-25" *ngIf="selectedPlacesNames.value.length > 1">
                +{{ (selectedPlacesNames.value.length + selectedUsers.length) - 1 | arabicNumbers }}
              </span>
            </span>

            <span *ngIf="!chat && selectedLevelsNames.value.length > 0">:
              <span *ngIf="selectedLevelsNames.value[0]?.nameAr.length >= 9">
                {{ selectedLevelsNames.value[0]?.nameAr | slice:0:9 }}...
              </span>
              <span *ngIf="selectedLevelsNames.value[0]?.nameAr.length < 9">
                {{ selectedLevelsNames.value[0]?.nameAr }}
              </span>
              <span class="bg-gray line-height rounded px-50 dark ml-25" *ngIf="selectedLevelsNames.value.length > 1">
                +{{ (selectedLevelsNames.value.length + selectedUsers.length) - 1 | arabicNumbers }}
              </span>
            </span>

            <span *ngIf="!chat && selectedJobTitlesNames.value.length > 0">:
              <span *ngIf="selectedJobTitlesNames.value[0]?.nameAr.length >= 9">
                {{ selectedJobTitlesNames.value[0]?.nameAr | slice:0:9 }}...
              </span>
              <span *ngIf="selectedJobTitlesNames.value[0]?.nameAr.length < 9">
                {{ selectedJobTitlesNames.value[0]?.nameAr }}
              </span>
              <span class="bg-gray line-height rounded px-50 dark ml-25" *ngIf="selectedJobTitlesNames.value.length > 1">
                +{{ (selectedJobTitlesNames.value.length + selectedUsers.length) - 1 | arabicNumbers }}
              </span>
            </span>
          </ng-container>
      </button>
  `,
  styles: [`
      .new-filter {
        .flex-inline {
          display: inline-flex;
          height: 18px;
          min-width: 18px;
        }
      }
  `]
})
export class SelectUserComponent {
  @Input() text!: string;
  @Input() selectedUsers: any[] = [];
  @Input() selectedDeprtment: any[] = [];
  @Input() selectedManagers: any[] = [];
  @Input() selectedPlaces: any[] = [];
  @Input() selectedLevels: any[] = [];
  @Input() selectedJobTitles: any[] = [];

  @Output() getSelectedUsers = new EventEmitter();
  @Output() selectedDepartments = new EventEmitter();
  @Output() selectedManagersChange = new EventEmitter();
  @Output() selectedPlacesChange = new EventEmitter();
  @Output() selectedLevelsChange = new EventEmitter();
  @Output() selectedJobTitlesChange = new EventEmitter();

  @Input() classes!: string;
  @Input() chat = false;
  @Input() multi = true;
  @Input() isTask = false;
  @Input() group = false;
  @Input() isEdit = false;
  @Input() newFilter = false;

  globalSer = inject(GlobalService);

  selectedDepartmentsNames = new BehaviorSubject<any>([]);
  selectedManagersNames = new BehaviorSubject<any[]>([]);
  selectedPlacesNames = new BehaviorSubject<any[]>([]);
  selectedLevelsNames = new BehaviorSubject<any[]>([]);
  selectedJobTitlesNames = new BehaviorSubject<any[]>([]);
  managersUsers: any;

  constructor(private dialog: MatDialog, public service: SelectUsersService) {
    this.selectedManagersChange.subscribe((res: any) => {
      this.selectedManagersNames.next(res.map((id: any) => {
        let name = this.globalSer.managers$.value.find((manager: any) => manager.id === id)
        return name;
      }));
    });

    this.selectedDepartments.subscribe((res: any) => {
      this.selectedDepartmentsNames.next(res.map((id: any) => {
        let name = this.globalSer.departments$.value.find((department: any) => department.id === id);
        return name
      }));
    });

    this.selectedPlacesChange.subscribe((res: any) => {
      this.selectedPlacesNames.next(res.map((id: any) => {
        let name = this.globalSer.places$.value.find((place: any) => place.id === id);
        return name;
      }));
    });
    this.selectedLevelsChange.subscribe((res: any) => {
      this.selectedLevelsNames.next(res.map((id: any) => {
        let name = this.globalSer.levels$.value.find((level: any) => level.id === id);
        return name;
      }));
    });

    this.selectedJobTitlesChange.subscribe((res: any) => {
      this.selectedJobTitlesNames.next(res.map((id: any) => {
        let name = this.globalSer.jobTitles$.value.find((job: any) => job.id === id);
        return name;
      }));
    });
  }

  openDialog() {
    let dialogRef = this.dialog.open(SelectUserDialogComponent, {
      panelClass: 'select-users-dialog',
      data: {
        selectedUsers: this.selectedUsers,
        selectedDepartments: this.selectedDeprtment.map(res => res.id),
        selectedManagers: this.selectedManagers.map(res => res.id),
        selectedPlaces: this.selectedPlaces.map(res => res.id),
        selectedLevels: this.selectedLevels.map(res => res.id),
        selectedJobTitles: this.selectedJobTitles.map(res => res.id),
        multi: this.multi,
        isTask: this.isTask,
        isEdit: this.isEdit,
        group: this.group,
      }

    });

    dialogRef.afterClosed().subscribe(res => {

      if (res?.changed) {
        this.selectedUsers = res.users;

        this.getSelectedUsers.emit(res.users);

        this.selectedDepartments.emit(res.selectedDepartments);

        this.selectedManagersChange.emit(res.selectedManagers);

        this.selectedPlacesChange.emit(res.selectedPlaces);

        this.selectedLevelsChange.emit(res.selectedLevels);

        this.selectedJobTitlesChange.emit(res.selectedJobTitles);
      }

    });
  }
}
