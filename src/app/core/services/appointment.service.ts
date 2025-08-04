import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable, signal} from '@angular/core';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from './alert.service';
import { Appointment } from '../interfaces/appointment';
import { SuccessMessageComponent } from '../components/success-message/success-message.component';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  myAppointments = signal<Appointment[]>([]);
  myAppointmentsDate: any;

  constructor(private http: HttpClient, private alert: AlertService, private dialog: MatDialog) {
  }

  addMyAppointments(data: any) {
    return this.http.post(`${environment.publicUrl}SessionDate/Create`, {dateRanges: data}).pipe(map((res: any) => {
      if (res.success) {
        this.alert.showAlert('appointment_added');
        this.dialog.closeAll();
        this.getMyAppointments(this.myAppointmentsDate).subscribe();
      }
    }));
  }

  deleteAppointment(id: number) {
    return this.http.delete(`${environment.publicUrl}SessionDate?SessionDateId=${id}`);
  }

  getMyAppointments(date: any = this.myAppointmentsDate) {
    this.myAppointmentsDate = date;
    let url = new URL(`${environment.publicUrl}SessionDate/GetMySessionDates`);
    let selectedDateStart = new Date(date.toISOString().split('T')[0] + 'T00:00:00').toISOString();
    let selectedDateEnd = new Date(date.toISOString().split('T')[0] + 'T23:59:59').toISOString();
    url.searchParams.append('startDateFrom', selectedDateStart);
    url.searchParams.append('startDateTo', selectedDateEnd);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.myAppointments.set(res.data.items);
      return res;
    }));
  }

  getConsultantAppointments(consultantId: number, date: Date) {
    let url = new URL(`${environment.publicUrl}SessionDate/GetConsultantSessionDates`);
    let selectedDateStart = new Date(date.toISOString().split('T')[0] + 'T00:00:00').toISOString();
    let selectedDateEnd = new Date(date.toISOString().split('T')[0] + 'T23:59:59').toISOString();
    url.searchParams.append('consultantId', consultantId + '');
    url.searchParams.append('startDateFrom', selectedDateStart);
    url.searchParams.append('startDateTo', selectedDateEnd);
    return this.http.get(`${url}`);
  }

  bookSession(data: any) {
    return this.http.post(`${environment.publicUrl}SessionDate/Book`, data);
  }

  confirmAppointment(id: number) {
    return this.http.post(`${environment.publicUrl}Order/ConfirmOrder`, {id},
      {
        headers: new HttpHeaders({
          "Authorization": localStorage.getItem('walletToken') + '',
        })
      }
    ).pipe(map((res: any) => {
      if (res.success) {
        this.dialog.closeAll();
        this.dialog.open(SuccessMessageComponent, {
          panelClass: 'success-dialog',
          data: {
            data: res.data,
            message: 'booking_success'
          }
        })
      }
      return res;
    }));
  }

}
