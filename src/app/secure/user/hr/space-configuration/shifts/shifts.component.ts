import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../../core/components/loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotFoundComponent } from '../../../../../core/components/not-found.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShiftsService } from '../../../../../core/services/shifts.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../../core/services/alert.service';
import { Shift } from '../../../../../core/interfaces/shift';
import { ArabicTimePipe } from '../../../../../core/pipes/arabic-time.pipe';
import { SearchComponent } from '../../../../../core/filters/search.component';
import { ConfirmationMessageComponent } from '../../../../../core/dialogs/confirmation-message.component';
import { ShiftUsersComponent } from '../../../../../core/components/shift-users/shift-users.component';
import { ArabicNumbersPipe } from '../../../../../core/pipes/arabic-numbers.pipe';
import { ShiftFormComponent } from '../../../../../core/components/shift-form/shift-form.component';

@Component({
  selector: 'shifts-config',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    NgxPaginationModule,
    NotFoundComponent,
    TranslateModule,
    ArabicTimePipe,
    SearchComponent,
    ArabicNumbersPipe,
  ],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss'],
})
export class ShiftsComponent implements OnInit, OnDestroy {
  searchValue: any;
  service = inject(ShiftsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  shifts: Shift[] = [];
  meta: any;
  loading = true;

  ngOnInit() {
    this.service.loading.subscribe((res) => (this.loading = res));
    this.service.meta.subscribe((res) => (this.meta = res));
    this.service.shifts$.subscribe((res: Shift[]) => (this.shifts = res));
  }

  getUsers(id: any, isDefault: boolean) {
    let dialogRef = this.dialog.open(ShiftUsersComponent, {
      panelClass: 'shift-users-dialog',
      data: {
        id,
        isDefault,
      },
    });
  }

  editShift(id: any) {
    let dialogRef = this.dialog.open(ShiftFormComponent, {
      disableClose: true,
      width: '552px',
      data: {
        isEdit: true,
        id,
      },
    });
  }

  deleteShift(shift: Shift) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_shift',
        btn_name: 'confirm',
        classes: 'bg-danger white',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.service.deleteShift(shift.id).subscribe((res: any) => {
          if (res.success) {
            this.dialog.closeAll();
            this.service.hasChanged.next(true);
            this.alert.showAlert('shift_deleted');
          }
        });
      }
    });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.service.loading.next(true);
  }

  openDialog() {
    this.dialog.open(ShiftFormComponent, {
      disableClose: true,
      width: '552px',
      data: {
        isEdit: false
      }
    })
  }
}
