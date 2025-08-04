import {Component, computed, Inject, OnInit, Signal, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import {TranslateModule} from '@ngx-translate/core';
import {CalendarComponent} from "../calendar/calendar.component";
import {MatButtonModule} from '@angular/material/button';
import {CdkStepper, CdkStepperModule} from '@angular/cdk/stepper';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {WeekViewComponent} from "../week-view/week-view.component";
import {AppointmentService} from '../../services/appointment.service';
import {Appointment} from '../../interfaces/appointment';
import {AlertService} from '../../services/alert.service';
import {LoadingComponent} from "../loading.component";
import {NotFoundComponent} from "../not-found.component";
import {ServiceProvidersService} from "../../services/service-providers.service";
import {UserImageComponent} from "../user-image.component";
import {UserProfile} from "../../interfaces/user-profile";
import {ConfirmWalletPasswordComponent} from "../confirm-wallet-password/confirm-wallet-password.component";
import {SessionCardComponent} from "../session-card.component";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {CheckoutComponent} from "../checkout/checkout.component";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'book-session',
  standalone: true,
  templateUrl: './book-session.component.html',
  styleUrls: ['./book-session.component.scss'],
  providers: [CdkStepper],
  imports: [CommonModule, MatDialogModule, MatStepperModule, TranslateModule, CalendarComponent, SessionCardComponent, MatButtonModule, CdkStepperModule, FormsModule, ReactiveFormsModule, InputErrorComponent, WeekViewComponent, LoadingComponent, NotFoundComponent, ArabicNumbersPipe, UserImageComponent, CheckoutComponent, InputLabelComponent, ArabicNumbersPipe, InputErrorComponent]
})
export class BookSessionComponent implements OnInit {
  dir: any = document.dir;
  selectedDate = new Date();
  form: FormGroup;
  sessions = signal<Appointment[]>([]);
  selectedSessions: number[] = [];
  loading = true;
  serviceProvider: Signal<UserProfile> = computed(() => this.providerSer.serviceProvider());
  checkout = false;
  invoiceId!: number;
  btnDisabled = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private appointmentSer: AppointmentService, private alert: AlertService, private dialog: MatDialog, private providerSer: ServiceProvidersService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.getConsultantAppointments(this.selectedDate);
  }

  getConsultantAppointments($event: any) {
    this.loading = true;
    this.appointmentSer.getConsultantAppointments(this.data.id, $event).subscribe((res: any) => {
      this.sessions.set(res.data.items);
      this.loading = false;
    });
  }

  selectSession(id: number) {
    if (this.selectedSessions.includes(id)) {
      this.selectedSessions = this.selectedSessions.filter(item => item !== id);
    } else {
      this.selectedSessions.push(id);
    }
  }

  bookSession() {
    this.btnDisabled = true;
    let data = {
      sessionDateIds: this.selectedSessions,
      title: this.form.value.title,
      describtion: this.form.value.description
    }
    this.appointmentSer.bookSession(data).subscribe((res: any) => {
      this.btnDisabled = false;
      if (res.success) {
        this.checkout = true;
        this.invoiceId = res.data.id;
      }
    });
  }

  confirmBooking() {
    this.btnDisabled = true;
    let ref = this.dialog.open(ConfirmWalletPasswordComponent, {
      width: '500px',
      data: {
        type: 'confirm_booking',
        id: this.invoiceId
      }
    })

    ref.afterClosed().subscribe((res: any) => {
      this.btnDisabled = false;
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  selectSessionError() {
    this.alert.showAlert('select_session_first', 'bg-danger')
  }

  get f() {
    return this.form.controls;
  }

  protected readonly environment = environment;
}
