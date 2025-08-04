import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { Loader } from '@googlemaps/js-api-loader';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-maps',
  standalone:true,
  imports:[GoogleMapsModule , FormsModule , CommonModule , TranslateModule , MatButtonModule ],
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent {
  @Output() mapChanged :any = new EventEmitter
  mapData :any

  title = 'maps';
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 25,
    minZoom: 3,
  };

  @Input() lat: any | number;
  @Input() long: any | number;
  @Input() noRadius = true;
  radius:any = this.noRadius ? 5 : 500;
  zoom = 15;
  circleCenter: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    icon: {
      url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADMUlEQVR4nO2Zy2sUQRDG2xcqPhBRoigIoiAo6MnHyVMgYHarZ2GjnnILCOZgEpPujTAoQbxJkoOvv8CDHryJF8VXIqKXgF4VicZEnarZlajRkZqNJpBN0pP0zM6KHzQMM0P1/Ka6v34J8V8zdTY7uk5J76QCvK6BninAjxrwOxe+VkCD4TPHP8HvirSp4BS3asArSlJJSwpMSvldvKEy3q5qf79obQhWaokXtKSiKcCMwhmTeIljiWqorZE2aYkPFgwwA4iedOSLWxKF0I6/T0l8aw1iqrzh2MlAZPy6mCCmYDJ+XawQbnOwiptAjBDBpBE8jrXPTHbsWCH0lAlcjM9iF+NOUbMC+E3lvJ3WQXicSCwb8k/Ba1Yh3PzIWgXkJw9CRa7bGghPOyL+yXEN1KuyeKi9/v0aLnytJPWFzyLF8pvsgfD8yLRtS3zX5RT3zxarAMUD/E6EeFetgfAE0DQTc0FMh4mQmQF7IBJHjSoF6jWOCdRvFhNHrIGwFZpUWpDeQdOYBQcPm2ZZ2JJpM4jiMPyuYUa+WgNREj9YB2kYW2/U2QGH7YEAvqpi0xqyByLpjplVUp/tzq4Ab1kD4Qmcacdka50vXjiWGBqIAjxvD0T6TVEGxLlgIg+IWczaA8nTZgX407hy/ttA/dwP2ADCuZrEI3zPNBO6/FN+sCkIm1ISX5p+gLUC+FDU9KJK/s1sh32QHO1JFgR/dec+77AOEsJIfJFgNu7HAlEGoVPJgfjHYwMJ50dAXgLZGG5pCVaIOKUlXY4dRFK3iFudTml79OVqJAh04csGkYR4+RlbRgB7RFIqHCtti2OPSwF9cvPeRpGkeDJnv1l5p0XSOpMPVtvczFaSXsfuVLNJSWy2B4KNolpy3WCplvR88SB4T1RbBd6jCo/PFtykSudyuFukQdp4BVmxSbWJtKi1fCg6tAC7Hczng2UiTSrwrgjgRIR+Md6Z8feKNEoD9hiDALaLtMo9GixXgI/mh6C77HgizerkSSXQ2ByZGOFjPFEL6pIEvFStADGhHa9e1JKUJLeCS3WJ2lOwRAHenOZSt/meqEW55aODAQX01OqhpviH9RsZsrt+kSutwwAAAABJRU5ErkJggg==',
      scaledSize: new google.maps.Size(40, 40),
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

  ngOnInit(){
    this.setCurrentLocation()
  }

  handleMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.circleCenter = event.latLng.toJSON();
      this.lat = this.circleCenter.lat;
      this.long = this.circleCenter.lng;
      this.emitChanges()
    }
  }

  handleRadiusChange(event: any) {
    this.radius = Number(event.target.value);
    this.emitChanges()
  }

  handleLatLong(event:any){
    this.circleCenter = { lat: this.lat, lng: this.long };
    this.emitChanges()
  }

  mapSearch() {
    const input = document.getElementById('search-input') as HTMLInputElement;
    const loader = new Loader({
      apiKey: 'AIzaSyCQTjrssgRFpFF8b0D2uURdyV7TEwKZ_w0',
      libraries: ['places'],
    });
    loader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          this.circleCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          this.lat = this.circleCenter.lat;
          this.long = this.circleCenter.lng;
          this.radius = 500;
          this.emitChanges()
        }
      });
    });
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = this.lat ||  position.coords.latitude;
          this.long = this.long ||  position.coords.longitude;
          this.circleCenter = { lat: this.lat, lng: this.long };
          this.mapData = {
            lat:    this.lat,
            long:   this.long,
            radius: this.radius,
          }
          this.emitChanges()
        },
        (error) => {
          this.setDefaultLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      this.setDefaultLocation();

    }
  }

  private setDefaultLocation() {
    this.lat = 30;
    this.long = 31;
    this.circleCenter = { lat: this.lat, lng: this.long };
    this.emitChanges()
  }

  emitChanges() {
    this.mapData = {
      lat: this.lat,
      long: this.long,
      radius: this.radius
    };
    this.mapChanged.emit(this.mapData); // Emit updated data
  }



}
