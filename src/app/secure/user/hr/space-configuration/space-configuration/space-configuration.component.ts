import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {LayoutComponent} from "../../../../../core/components/layout.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {InputLabelComponent} from "../../../../../core/inputs/input-label.component";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../../../../../core/components/submit-button.component";
import {SpacesService} from "../../../../../core/services/spaces.service";
import {AlertService} from "../../../../../core/services/alert.service";
import {capitalizeFirstLetter} from "../../../../../core/functions/capitalize";

@Component({
  selector: 'space-leaves-settings',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MatSlideToggleModule, TranslateModule, FormsModule, InputLabelComponent, NgxMaterialTimepickerModule, MatCheckboxModule, MatButtonModule, SubmitButtonComponent],
  templateUrl: './space-configuration.component.html',
  styleUrls: ['./space-configuration.component.scss']
})
export class SpaceConfigurationComponent implements OnInit {
  spaceSer = inject(SpacesService)
  from = '';
  to = '';
  workingHours = 1;
  leaveSystem = false;
  loading = false;
  weekends: string[] = [];
  dataLoaded = false;
  isUpdate = false;
  alert = inject(AlertService);
  utcOffset: any = new Date().getTimezoneOffset();

  ngOnInit() {
    this.spaceSer.spaceConfiguration$.subscribe((res: any) => {
      if (!!res.workingHours) {
        this.dataLoaded = true;
        this.workingHours = +res.workingHours.split(':')[0];
        let checkin = new Date(res.checkInTime);
        let checkout = new Date(res.checkOutTime);
        checkin.setHours(checkin.getHours() - (this.utcOffset / 60));
        checkout.setHours(checkout.getHours() - (this.utcOffset / 60));
        this.from = formatDate(checkin, 'HH:mm', 'en-US');
        this.to = formatDate(checkout, 'HH:mm', 'en-US');
        this.weekends = res.weekEnds?.toLowerCase()?.split(',') || [];
        this.leaveSystem = res.leaveSystem;
        this.isUpdate = !(res.workingHours == '00:00');
      }
    })
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

  submit() {
    this.loading = true;
    let checkInTime = formatDate(`2001-01-01 ${this.from}`, 'yyyy-MM-ddTHH:mm:ssZ', 'en-US');
    let checkOutTime = formatDate(`2001-01-01 ${this.to}`, 'yyyy-MM-ddTHH:mm:ssZ', 'en-US');
    let data: any = {
      weekEnds: this.weekends.map((day: any) => capitalizeFirstLetter(day)),
      checkInTime,
      checkOutTime,
      workingHoursTime: `${this.workingHours < 10 ? '0' : ''}${this.workingHours}:00`,
      leaveSystem: this.leaveSystem,
      update: true,
      fromDay : this.spaceSer.spaceConfiguration$.value.fromDay,
      toDay : this.spaceSer.spaceConfiguration$.value.toDay,
      crossMonth : this.spaceSer.spaceConfiguration$.value.crossMonth
    }
    // Add the update property only if this.isUpdate is true
    if (!this.isUpdate) {
      data.leaveTypeNameEn = 'Annual';
      data.leaveTypeNameAr = 'سنوي';
      data.update = false;
    }
    this.spaceSer.updateSpaceConfiguration(data).subscribe((res: any) => {
      if (res.success) {
        this.loading = false;
        this.alert.showAlert('space_configuration_updated')
      }
    });
  }

  add() {
    this.workingHours++
  }

  minus() {
    if (this.workingHours > 1) {
      this.workingHours--
    }
  }
}
