import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { ArabicNumbersPipe } from '../../pipes/arabic-numbers.pipe';
import { AlertService } from '../../services/alert.service';
import { RatingService } from '../../services/rating.service';
import { DateRangeComponent } from '../date-range/date-range.component';
import { SpaceUsersComponent } from '../../filters/space-users.component';

@Component({
  selector: 'emoloyee-rate',
  templateUrl: './emoloyee-rate.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    ArabicNumbersPipe,
    NgxStarRatingModule,
    DateRangeComponent,
    SpaceUsersComponent,
  ],
  styleUrls: ['./emoloyee-rate.component.scss'],
})
export class EmoloyeeRateComponent {
  rated = false;
  rate = 0;
  rateReason = '';
  selectedUser: any;
  dateFrom:any = this.datePipe.transform(new Date(), 'yyyy-MM-01');
  dateTo:any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  constructor(
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: RatingService,
    private dialog: MatDialog,
    private alert: AlertService,
  ) {}
  selectUser(event: any) {
    this.selectedUser = event
  }
  ratedFun() {
    this.rated = true;
  }

  dateChanged(event: any) {
    console.log(event);
    this.dateFrom = this.datePipe.transform(event.startDate, 'yyyy-MM-dd');
    this.dateTo = this.datePipe.transform(event.endDate, 'yyyy-MM-dd');
  }
  submit() {
    let data: any;
    data = {
      raterId: localStorage.getItem('id'),
      ratedId: this.selectedUser,
      comment: this.rateReason || '',
      rate:this.rate ,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
    };
    this.service.rateUser(data).subscribe((res: any) => {
      if(res.success){
        this.dialog.closeAll();
        this.alert.showAlert('success');
      }
    });
  }
}
