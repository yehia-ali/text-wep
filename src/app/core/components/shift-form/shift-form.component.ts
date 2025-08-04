import { Component, ElementRef, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorComponent } from '../../inputs/input-error.component';
import { InputLabelComponent } from '../../inputs/input-label.component';
import { ToggleSwitchComponent } from '../../inputs/toggle-switch.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { SubmitButtonComponent } from '../submit-button.component';
import { capitalizeFirstLetter } from '../../functions/capitalize';
import { ShiftsService } from '../../services/shifts.service';
import { AlertService } from '../../services/alert.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { Loader } from '@googlemaps/js-api-loader';
import {  MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'shift-form',
  standalone: true,
  providers:[DatePipe],
  imports: [
    GoogleMapsModule,
    CommonModule,
    BidiModule,
    FormsModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    InputErrorComponent,
    InputLabelComponent,
    ToggleSwitchComponent,
    NgSelectModule,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    SubmitButtonComponent,
    MatSlideToggleModule
  ],
  templateUrl: './shift-form.component.html',
  styleUrls: ['./shift-form.component.scss'],
})
export class ShiftFormComponent implements OnInit {
apsentChange(value: boolean) {
 this.apsent = value;
}
lateChange(value: boolean) {
 this.late = value;
}
  addressSuggestions: any[] = [];
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  service = inject(ShiftsService);
  dialog = inject(MatDialog);
  alert = inject(AlertService);
  form: FormGroup;
  from: any = '';
  to: any = '';
  weekends: string[] = [];
  loading = false;
  shift: any;
  mapCircle: any;
  // map
  map = true;
  title = 'angular-google-maps';
  lat: any | number;
  lng: any | number;
  zoom = 15;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 25,
    minZoom: 3,
  };

  circleCenter: google.maps.LatLngLiteral;

  radius = 500;

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
  apsent: any;
  late: any;
  // map
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private datePipe : DatePipe
  ) {
    this.form = this.fb.group({
      shiftName: ['', Validators.required],
      requiredWorkingHoursDaily: ['', Validators.required],
      requiredWorkingHoursMonthly: ['', Validators.required],
      allowanceInMinutes: [null, Validators.required],
      long: [''],
      lat: [''],
      radius: [''],
      allowAbsence: [''],
      allowLate: [''],
      preventCheckIn: [true],
      crossDay: [false],
    });
  }

  ///se
  mapSearch() {
    // Initialize Google Places Autocomplete
    const input = document.getElementById('search-input') as HTMLInputElement;

    // Load the Google Maps API with places library
    const loader = new Loader({
      apiKey: 'AIzaSyCQTjrssgRFpFF8b0D2uURdyV7TEwKZ_w0', // Replace with your Google Maps API Key
      libraries: ['places'],
    });

    loader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(input);

      // Add listener for place changes
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        // Update the map center and marker with the selected place
        if (place.geometry && place.geometry.location) {
          this.circleCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          this.lat = this.circleCenter.lat;
          this.lng = this.circleCenter.lng;
          this.radius = 500; // Set a default radius or adjust as needed
        }
      });
    });

    // Your existing ngOnInit code here...
  }

  // search
  ngOnInit() {

    if (this.data.isEdit) {
      let utcOffset: any = new Date().getTimezoneOffset();
      this.service.getShiftById(this.data.id).subscribe((res) => {
        this.form.patchValue(res);

        const checkin = new Date(
          new Date(res.checkIn).setMinutes(
            new Date(res.checkIn).getMinutes() - utcOffset
          )
        );
        this.from = `${checkin.getHours() % 12 || 12}:${checkin
          .getMinutes()
          .toString()
          .padStart(2, '0')} ${checkin.getHours() >= 12 ? 'PM' : 'AM'}`;

        const checkout = new Date(
          new Date(res.checkOut).setMinutes(
            new Date(res.checkOut).getMinutes() - utcOffset
          )
        );
        this.to = `${checkout.getHours() % 12 || 12}:${checkout
          .getMinutes()
          .toString()
          .padStart(2, '0')} ${checkout.getHours() >= 12 ? 'PM' : 'AM'}`;

        this.weekends = res.weekEnds
          .split(',')
          .map((day: any) => day.toLowerCase());
        this.map = res.preventCheckIn;
        this.apsent = res.allowAbsence;
        this.late = res.allowLate;
        this.radius = res.radius;

        // Ensure lat and lng are numbers and log for debugging
        this.lat = parseFloat(res.lat);
        this.lng = parseFloat(res.long);

        this.circleCenter = { lat: this.lat, lng: this.lng };

        if (isNaN(this.lat) || isNaN(this.lng)) {
          this.setCurrentLocation()
        }
      });
    } else {
      this.setCurrentLocation()
    }
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
  handleLatLong(event:any){
    this.circleCenter = { lat: this.lat, lng: this.lng };
  }
  onCheckboxChange(value: boolean) {
    this.map = value;
    if (!this.map) {
      this.lat = '0';
      this.lng = '0';
      this.radius = 0;
    }
  }

  submit() {
    this.loading = true;
    let utcOffset: any = new Date().getTimezoneOffset();
    let currentDate = this.datePipe.transform(new Date() , 'yyyy-MM-dd')
    let checkIn: any = formatDate(
      `${currentDate} ${this.from}`,
      'yyyy-MM-ddTHH:mm:ss',
      'en-US'
    );
    let checkOut: any = formatDate(
      `${currentDate}  ${this.to}`,
      'yyyy-MM-ddTHH:mm:ss',
      'en-US'
    );
    checkIn = new Date(
      new Date(checkIn).setMinutes(new Date(checkIn).getMinutes() + utcOffset)
    );
    checkOut = new Date(
      new Date(checkOut).setMinutes(new Date(checkOut).getMinutes() + utcOffset)
    );
    checkIn = formatDate(checkIn, 'yyyy-MM-ddTHH:mm:ss', 'en-US') + 'Z';
    checkOut = formatDate(checkOut, 'yyyy-MM-ddTHH:mm:ss', 'en-US') + 'Z';
    console.log(checkIn)
    console.log(checkOut)
    let data: any = {
      ...this.form.value,
      weekEnds: this.weekends
        .map((day: any) => capitalizeFirstLetter(day))
        .join(','),
      checkIn,
      checkOut,
      requiredWorkingHoursDaily: this.form.value.requiredWorkingHoursDaily,
      requiredWorkingHoursMonthly: this.form.value.requiredWorkingHoursMonthly,
      long: this.lng,
      lat: this.lat,
      radius: this.radius,
      preventCheckIn: this.map,
      allowAbsence:this.apsent,
      allowLate:this.late,
      ...(this.data.isEdit && { id: this.data.id }),
    };

    if (this.form.valid) {
      const shiftObservable = this.data.isEdit
        ? this.service.updateShift(data)
        : this.service.addShift(data);
      shiftObservable.subscribe((res: any) => {
        if (res.success) {
          const alertMessage = this.data.isEdit
            ? 'shift_updated'
            : 'shift_created';
          this.alert.showAlert(alertMessage);
          this.dialog.closeAll();
          this.service.hasChanged.next(true);
        } else {
          this.loading = false;
        }
      });
    }
  }

  weekendChanged(event: any) {
    let day = event.source.value;
    const index = this.weekends.indexOf(day);
    if (index !== -1) {
      this.weekends.splice(index, 1);
    } else {
      this.weekends.push(day);
    }
  }

  get f() {
    return this.form.controls;
  }

  setCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successful retrieval of location
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.circleCenter = { lat: this.lat, lng: this.lng };
        console.log('Current position:', position);
      },
      (error) => {
        // Handle errors appropriately
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('Permission denied by the user.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('Position unavailable.');
            break;
          case error.TIMEOUT:
            console.error('Request timed out.');
            break;
          default:
            console.error('An unknown error occurred.');
            break;
        }
        this.setDefaultLocation(); // Set to default if there is an error
      },
      {
        enableHighAccuracy: true, // Request high accuracy (uses GPS if available)
        timeout: 10000, // Set a reasonable timeout (10 seconds)
        maximumAge: 0 // Ensure the location is not cached
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    this.setDefaultLocation(); // Geolocation not available
  }
}


  private setDefaultLocation() {
    // Set default location if current location is not available
    this.lat = 30; // default latitude
    this.lng = 31; // default longitude
    this.circleCenter = { lat: this.lat, lng: this.lng };
  }

}
