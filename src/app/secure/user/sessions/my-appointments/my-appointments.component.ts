import {Component, computed, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from "../../../../core/components/calendar/calendar.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MatButtonModule} from "@angular/material/button";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {Appointment} from "../../../../core/interfaces/appointment";
import {MatDialog} from "@angular/material/dialog";
import {AppointmentService} from "../../../../core/services/appointment.service";
import {AlertService} from "../../../../core/services/alert.service";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {SessionCardComponent} from "../../../../core/components/session-card.component";
import {AddAppointmentComponent} from "../../../../core/components/add-appointment/add-appointment.component";

@Component({
  selector: 'my-appointments',
  standalone: true,
  imports: [CommonModule, CalendarComponent, MagicScrollDirective, TranslateModule, LayoutComponent, MatButtonModule, LoadingComponent, NotFoundComponent, ArabicDatePipe, SessionCardComponent],
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent {
  appointments: Signal<Appointment[]> = computed(() => this.service.myAppointments())
  currentDate = new Date();
  selectedDate = new Date();
  loading = true;
  disablePreviousDay = true;
  dateToSend!: any;

  constructor(private dialog: MatDialog, private service: AppointmentService, private alert: AlertService) {
  }

  ngOnInit() {
    this.getMyAppointments(this.selectedDate, true);
  }


  addAppointment() {
    this.dialog.open(AddAppointmentComponent, {
      panelClass: 'medium-dialog'
    });
  }

  getMyAppointments($event = this.dateToSend, firstTime = false) {
    this.dateToSend = $event;
    this.loading = true;
    if (!firstTime) {
      this.selectedDate = new Date(this.dateToSend.getFullYear(), this.dateToSend.getMonth(), this.dateToSend.getDate() - 1);
    }
    this.service.getMyAppointments(this.dateToSend).subscribe((res: any) => {
      this.loading = false;
    });
    // check if the selected date is today
    this.disablePreviousDay = this.selectedDate.getDate() === new Date().getDate() && this.selectedDate.getMonth() === new Date().getMonth() && this.selectedDate.getFullYear() === new Date().getFullYear();
  }

  previousDay() {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate());
    let currentDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() - 1);
    this.currentDate = new Date(this.currentDate.setMonth(currentDate.getMonth()));
    this.getMyAppointments(this.selectedDate);
  }

  nextDay() {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + 2);
    let currentDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() - 1);
    this.currentDate = new Date(this.currentDate.setMonth(currentDate.getMonth()));
    this.getMyAppointments(this.selectedDate);
  }

  deleteAppointment(appointment: Appointment) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_appointment',
        btn_name: 'confirm',
        classes: 'bg-primary white'
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.service.deleteAppointment(appointment.id).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('appointment_deleted');
            this.getMyAppointments(undefined, true);
          }
        });
      }
    });
  }

}
