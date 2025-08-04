import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {GoogleMapsModule} from "@angular/google-maps";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";

@Component({
  selector: 'location',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @Input() isMeeting = false;
  @Input() isLocation = false;
  @Input() task: any;
  @Output() formValues = new EventEmitter();
  center!: google.maps.LatLngLiteral;
  markers: any = [];
  form: FormGroup;
  geoCoder: any;
  address = '';
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    maxZoom: 25,
    minZoom: 8,
  };

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.form = this.fb.group({
      link: [null, Validators.required],
      latitude: [null],
      longitude: [null],
    })
  }

  ngOnInit(): void {
    this.formValues.emit(this.form);
    this.geoCoder = new google.maps.Geocoder();
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.markers = [{
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        label: {
          color: 'red',
          text: this.translate.instant('you_are_here')
        },
        options: {animation: google.maps.Animation.BOUNCE},
      }]
    });
    this.form.valueChanges.subscribe(() => {
      this.formValues.emit(this.form);
    });
  }

  getCurrentLocation() {
    this.geoCoder.geocode({
      'location': {
        lat: this.center.lat,
        lng: this.center.lng
      }
    }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.address = results[0].formatted_address;
        }
      }
    });
    this.markers = [{
      position: {
        lat: this.center.lat,
        lng: this.center.lng,
      },
      label: {
        color: '#7b58ca',
        text: ' '
      },
      title: 'Marker title ' + (this.markers.length + 1),
      options: {animation: google.maps.Animation.BOUNCE},
    }];
    this.form.patchValue({
      latitude: this.center.lat,
      longitude: this.center.lng
    });
  }

  getTaskLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: this.task.latitude,
        lng: this.task.longitude,
      };
      this.markers = [{
        position: {
          lat: this.task.latitude,
          lng: this.task.longitude,
        },
        label: {
          color: 'red',
          text: this.translate.instant('.')
        },
        options: {animation: google.maps.Animation.BOUNCE},
      }]
    });

    this.geoCoder.geocode({
      'location': {
        lat: this.task.latitude,
        lng: this.task.longitude
      }
    }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.address = results[0].formatted_address;
        }
      }
    });
    this.form.patchValue({
      latitude: this.task.latitude,
      longitude: this.task.longitude,
      link: this.task.link
    })
  }

  resetLocation() {
    this.form.patchValue({
      latitude: null,
      longitude: null,
      link: null
    });
  }

  clearAddress() {
    this.address = "";
    this.markers = []
    this.form.patchValue({
      latitude: null,
      longitude: null
    })
  }

  addMarker($event: any) {
    let lat: number = +JSON.stringify($event.latLng.lat());
    let lng: number = +JSON.stringify($event.latLng.lng());
    this.markers = [{
      position: {
        lat: lat,
        lng: lng,
      },
      label: {
        color: '#7b58ca',
        text: ' '
      },
      title: 'Marker title ' + (this.markers.length + 1),
      options: {animation: google.maps.Animation.BOUNCE},
    }];
    this.form.patchValue({
      latitude: lat,
      longitude: lng
    })
    this.geoCoder.geocode({'location': {lat, lng}}, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.address = results[0].formatted_address;
        }
      }
    });
  }

  get f() {
    return this.form.controls;
  }

}
