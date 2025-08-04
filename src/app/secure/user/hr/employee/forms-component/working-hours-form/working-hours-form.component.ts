import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { GoogleMapsModule } from '@angular/google-maps';
import { AlertService } from 'src/app/core/services/alert.service';
import { InputLabelComponent } from "../../../../../../core/inputs/input-label.component";
import { SubmitButtonComponent } from "../../../../../../core/components/submit-button.component";
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';

@Component({
  selector: 'working-hours-form',
  standalone: true,
  providers:[DatePipe],
  imports: [
    GoogleMapsModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    InputLabelComponent,
    SubmitButtonComponent
],
  templateUrl: './working-hours-form.component.html',
  styleUrls: ['./working-hours-form.component.scss'],
})
export class WorkingHoursFormComponent implements OnInit {
  service = inject(HrEmployeesService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  form: FormGroup;
  loading = false;
  map = true;
  lat = 30; // Default latitude
  lng = 31; // Default longitude
  zoom = 15;
  selectedDays: any[] = [];
  circleCenter: google.maps.LatLngLiteral;
  radius = 500;

  weekends: string[] = [];
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 25,
    minZoom: 3,
  };
  markerOptions: google.maps.MarkerOptions = {
    icon: {
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADMUlEQVR4nO2Zy2sUQRDG2xcqPhBRoigIoiAo6MnHyVMgYHarZ2GjnnILCOZgEpPujTAoQbxJkoOvv8CDHryJF8VXIqKXgF4VicZEnarZlajRkZqNJpBN0pP0zM6KHzQMM0P1/Ka6v34J8V8zdTY7uk5J76QCvK6BninAjxrwOxe+VkCD4TPHP8HvirSp4BS3asArSlJJSwpMSvldvKEy3q5qf79obQhWaokXtKSiKcCMwhmTeIljiWqorZE2aYkPFgwwA4iedOSLWxKF0I6/T0l8aw1iqrzh2MlAZPy6mCCmYDJ+XawQbnOwiptAjBDBpBE8jrXPTHbsWCH0lAlcjM9iF+NOUbMC+E3lvJ3WQXicSCwb8k/Ba1Yh3PzIWgXkJw9CRa7bGghPOyL+yXEN1KuyeKi9/v0aLnytJPWFzyLF8pvsgfD8yLRtS3zX5RT3zxarAMUD/E6EeFetgfAE0DQTc0FMh4mQmQF7IBJHjSoF6jWOCdRvFhNHrIGwFZpUWpDeQdOYBQcPm2ZZ2JJpM4jiMPyuYUa+WgNREj9YB2kYW2/U2QGH7YEAvqpi0xqyByLpjplVUp/tzq4Ab1kD4Qmcacdka50vXjiWGBqIAjxvD0T6TVEGxLlgIg+IWczaA8nTZgX407hy/ttA/dwP2ADCuZrEI3zPNBO6/FN+sCkIm1ISX5p+gLUC+FDU9KJK/s1sh32QHO1JFgR/dec+77AOEsJIfJFgNu7HAlEGoVPJgfjHYwMJ50dAXgLZGG5pCVaIOKUlXY4dRFK3iFudTml79OVqJAh04csGkYR4+RlbRgB7RFIqHCtti2OPSwF9cvPeRpGkeDJnv1l5p0XSOpMPVtvczFaSXsfuVLNJSWy2B4KNolpy3WCplvR88SB4T1RbBd6jCo/PFtykSudyuFukQdp4BVmxSbWJtKi1fCg6tAC7Hczng2UiTSrwrgjgRIR+Md6Z8feKNEoD9hiDALaLtMo9GixXgI/mh6C77HgizerkSSXQ2ByZGOFjPFEL6pIEvFStADGhHa9e1JKUJLeCS3WJ2lOwRAHenOZSt/meqEW55aODAQX01OqhpviH9RsZsrt+kSutwwAAAABJRU5ErkJggg==',
      scaledSize: new google.maps.Size(40, 40), // Adjust the size
    },
  };
  circleOptions: google.maps.CircleOptions = {
    strokeColor: '#7B58CA',
    strokeOpacity: 0.2,
    strokeWeight: 2,
    fillColor: '#7B58CA',
    fillOpacity: 0.15,
    editable: false,
    draggable: false,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder , private datePipe : DatePipe , private ref: MatDialogRef<WorkingHoursFormComponent>) {
    this.form = this.fb.group({
      weekDay: [''],
      checkInTime: ['', Validators.required],
      checkOutTime: ['', Validators.required],
      checkInAllowance: [0],
      checkOutAllowance: [0],
      workingHours: ['', Validators.required],
      earlyCheckIn: [0],
      long: [''],
      lat: [''],
      radius: [''],
      preventChackin: [true],
      shiftId:['']
    });
  }

  ngOnInit() {
    console.log(this.data)
      this.lat = 30;
      this.lng = 31;
      this.circleCenter = { lat: this.lat, lng: this.lng };

  }

  handleMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.circleCenter = event.latLng.toJSON();
      this.lat = this.circleCenter.lat;
      this.lng = this.circleCenter.lng;
    }
  }

  handleRadiusChange(event: any) {
    this.radius = Number(event.target.value);
  }

  onCheckboxChange(event: any) {
    this.map = !this.map;
    if (!this.map) {
      this.lat = 0;
      this.lng = 0;
      this.radius = 0;
    }
  }
  submit() {
    this.loading = true;
    let date = this.datePipe.transform(new Date() ,'yyyy-MM-dd' )
    const checkInTime = this.datePipe.transform(`${date} ${this.form.value.checkInTime}`, 'yyyy-MM-ddTHH:mm:ss', 'UTC');
    const checkOutTime = this.datePipe.transform(`${date} ${this.form.value.checkOutTime}`, 'yyyy-MM-ddTHH:mm:ss', 'UTC');

    this.selectedDays.forEach(day => {
        const data = {
            ...this.form.value,
            weekDay: day.weekDay,
            shiftId: this.data.shiftId,
            checkInTime: checkInTime + 'Z',
            checkOutTime: checkOutTime + 'Z',
            long: this.lng,
            lat: this.lat,
            radius: this.radius,
            preventChackin: this.map,
        };

        if (this.form.valid) {
            const shiftObservable = this.data.isEdit ? this.service.updateShiftDay(data) : this.service.createShiftDay(data);
            shiftObservable.subscribe((res: any) => {
                this.loading = false;
                if (res.success) {
                    this.ref.close(true);
                    this.alert.showAlert(this.data.isEdit ? 'shift_updated' : 'shift_created');
                }
            });
        }
    });

}



  weekendChanged(day: any) {
    const index = this.selectedDays.indexOf(day);

    if (index > -1) {
        // If the day is already in the array, remove it
        this.selectedDays.splice(index, 1);
    } else {
        // If the day is not in the array, add it
        this.selectedDays.push(day);
    }
    console.log(this.selectedDays);
}


  get f() {
    return this.form.controls;
  }
}
