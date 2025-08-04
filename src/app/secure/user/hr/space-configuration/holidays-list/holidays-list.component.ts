import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import {LeavesRequestsService} from "../../../../../core/services/leaves-requests.service";
import {BehaviorSubject, debounceTime, map, Subscription, switchMap} from "rxjs";
import {ArabicDatePipe} from "../../../../../core/pipes/arabic-date.pipe";
import { MatDialog } from '@angular/material/dialog';
import { AddHolidayFormComponent } from 'src/app/core/components/add-holiday-form/add-holiday-form.component';
import { YearFilterComponent } from "src/app/core/filters/year-filter.component";
import * as moment from 'moment';
import { ConfirmationMessageComponent } from 'src/app/core/dialogs/confirmation-message.component';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'holidays-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, YearFilterComponent, YearFilterComponent],
  templateUrl: './holidays-list.component.html',
  styleUrls: ['./holidays-list.component.scss']
})
export class HolidaysListComponent implements OnInit, OnDestroy {
  service = inject(LeavesRequestsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  constructor(){}
  holidays: any = [];
  loading = true;
  year = new BehaviorSubject<string>(moment().format('YYYY'));
    ngOnInit() {

      this.service.year.next(this.year.value)
      this.service.hasChanged.pipe(debounceTime(400), switchMap(() => {
      this.service.loading.next(true);
      return this.service.getHolidays().pipe(map((res: any) => {
        this.holidays = this.transformHolidaysData(res.data);
        this.service.loading.next(false);
        this.loading = false;
      }))
    })).subscribe();
  }
  transformHolidaysData(data: any[]): any[] {
    const flattenedHolidays: any[] = [];
    data.forEach(group => {
      if (group && Array.isArray(group) && group.length > 0) {
        const sortedGroup = group.sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        const firstDate = new Date(sortedGroup[0].date);
        const lastDate = new Date(sortedGroup[sortedGroup.length - 1].date);
        const daysDiff = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const holidayGroup = {
          groupIds: sortedGroup.map((item: any) => item.id),
          startDate: firstDate,
          endDate: lastDate,
          daysNumber: daysDiff,
          nameAr: sortedGroup[0].nameAr,
          nameEn: sortedGroup[0].nameEn,
          spaceId: sortedGroup[0].spaceId,
          creationDate: sortedGroup[0].creationDate,
          isDeleted: sortedGroup[0].isDeleted,
          deleterUserId: sortedGroup[0].deleterUserId,
          deletionDate: sortedGroup[0].deletionDate,
          lastModifierUserId: sortedGroup[0].lastModifierUserId,
          lastModificationDate: sortedGroup[0].lastModificationDate,
          originalGroup: sortedGroup // Keep original data if needed
        };
        
        flattenedHolidays.push(holidayGroup);
      }
    });
    
    // Sort the final result by start date
    return flattenedHolidays.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.service.loading.next(true)
  }

  addHoliday() {    
    let dialogRef = this.dialog.open(AddHolidayFormComponent, {
      width: '550px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.service.hasChanged.next(true)
    })
  }

  isDatePassed(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }
  deleteHolidayGroupConfirmation(groupIds: any) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_holiday_group_message',
        btn_name: "delete",
        classes: 'w-100 bg-danger',
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.service.deleteHolidayGroup(groupIds).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('holiday_group_deleted')
            this.service.hasChanged.next(true)
          }
        })
      }
    })
  }

 
}
