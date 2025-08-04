import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {SpacesService} from "../../../../core/services/spaces.service";
import {AlertService} from "../../../../core/services/alert.service";

@Component({
  selector: 'configuration',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MatSlideToggleModule, TranslateModule, FormsModule],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  spaceSer = inject(SpacesService)
  leaveSystem = false;
  alert = inject(AlertService);

  ngOnInit() {
    this.spaceSer.spaceConfiguration$.subscribe((res: any) => {
      if (!!res.workingHours) {
        this.leaveSystem = res.leaveSystem;
      }
    })
  }


  updateLeaveSystem(value: any) {
    let data = {
      leaveSystem: value,
      fromDay : this.spaceSer.spaceConfiguration$.value.fromDay,
      toDay : this.spaceSer.spaceConfiguration$.value.toDay,
      crossMonth : this.spaceSer.spaceConfiguration$.value.crossMonth
    }
    this.spaceSer.updateSpaceConfiguration(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('space_configuration_updated')
      }
    });
  }
}
