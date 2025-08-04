import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoogleMapsModule} from "@angular/google-maps";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'display-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, MatDialogModule],
  template: `
      <div class="flex aic jcsb py-1 pr-1 pl-2">
          <p class="fs-18 primary">{{data?.address}}</p>
          <i class="bx bx-x danger fs-35 line-height pointer" mat-dialog-close></i>
      </div>
      <google-map
              (mapInitialized)="onMapLoad($event)"
              height="500px"
              width="100%"
              [zoom]="15"
              [center]="center"
              [options]="options">
          <map-marker
                  *ngFor="let marker of markers"
                  [position]="marker.position"
                  [label]="marker.label"
                  [title]="marker.title"
                  [options]="marker.options"
          >
          </map-marker>
      </google-map>
  `,
  styles: []
})
export class DisplayMapComponent implements OnInit {
  map!: google.maps.Map;
  center = {lat: this.data.lat, lng: this.data.lng};
  markers: google.maps.Marker[] | any = []
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    maxZoom: 25,
    minZoom: 8,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.markers = [{
      position: {
        lat: this.data.lat,
        lng: this.data.lng,
      },
      label: {
        color: '#fff',
        text: ' '
      },
      title: 'Marker title ' + (this.markers.length + 1)
    }];
  }

  onMapLoad(map: google.maps.Map): void {
    this.map = map;
  }
}
