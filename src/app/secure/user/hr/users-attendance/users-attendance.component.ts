import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotFoundComponent } from '../../../../core/components/not-found.component';
import { LoadingComponent } from '../../../../core/components/loading.component';
import { ArabicDatePipe } from '../../../../core/pipes/arabic-date.pipe';
import { LayoutWithFiltersComponent } from '../../../../core/components/layout-with-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserImageComponent } from '../../../../core/components/user-image.component';
import * as XLSX from 'xlsx';
import { UsersAttendanceService } from '../../../../core/servicess/users-attendance.service';
import { UsersAttendance } from '../../../../core/interfaces/users-attendance';
import { UsersAttendanceFilterComponent } from './users-attendance-filter/users-attendance-filter.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DisplayMapComponent } from '../../../../core/components/display-map.component';
import { InputLabelComponent } from '../../../../core/inputs/input-label.component';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'users-attendance',
  standalone: true,
  imports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatDialogModule,
    CommonModule,
    NotFoundComponent,
    LoadingComponent,
    ArabicDatePipe,
    LayoutWithFiltersComponent,
    TranslateModule,
    NgxPaginationModule,
    UserImageComponent,
    UsersAttendanceFilterComponent,
    InputLabelComponent,
    FormsModule
  ],
  templateUrl: './users-attendance.component.html',
  styleUrls: ['./users-attendance.component.scss'],
  providers:[DatePipe],
})
export class UsersAttendanceComponent implements OnInit {
  selectedAttendance:any
  meta: any;
  loading = false;
  reports!: UsersAttendance[];
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  newAttendanceDate: string | null;
  constructor(
    public service: UsersAttendanceService,
    private elm: ElementRef,
    private dialog: MatDialog,
    private datePipe: DatePipe,

  ) {}

  getReport() {
    this.service.hasChanged.next(true);
  }

  getLocation(report: UsersAttendance) {
    this.dialog.open(DisplayMapComponent, {
      panelClass: 'display-map-dialog',
      autoFocus: false,
      data: {
        lat: report.latitude,
        lng: report.longitude,
        address: report.address,
      },
    });
  }

  ngOnInit(): void {
    this.service.reports$.subscribe((res) => (this.reports = res));
    this.service.meta.subscribe((res) => (this.meta = res));
    this.service.loading.subscribe((res) => (this.loading = res));
  }

  changePage($event: any) {
    this.service.page.next($event);
    this.getReport();
  }

  limitChanged(e: any) {
    this.service.page.next(1);
    this.service.limit.next(e);
    this.getReport();
  }

  exportToExcel() {
    /* pass here the table id */
    let element = this.elm.nativeElement.querySelector('#attendance');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'attendance.xlsx');
  }

  trackBy(index: any, item: any) {
    return item.taskId;
  }

  openDialog(report: any) {
    this.selectedAttendance =  report
    this.dialog.open(this.dialogTemplate,{
      width:'500px',
    });
  }

  updateAttendance() {
    console.log(45564465654)
    let data = {
        id: this.selectedAttendance.id,
        dateTime: this.newAttendanceDate
    }
    this.service.updateAttendance(data).subscribe((res:any) => {
      console.log(res)
    })
  }

  closeDialog() {
    this.dialog.closeAll()
  }

  onDateChange($event: any) {
    this.newAttendanceDate = this.datePipe.transform($event.value , 'yyyy-MM-ddThh:mm:00' , "UTC")
  }
}
