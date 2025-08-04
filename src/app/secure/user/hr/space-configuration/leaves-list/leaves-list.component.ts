import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LeavesRequestsService} from "../../../../../core/services/leaves-requests.service";
import {Subscription} from "rxjs";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {TranslateModule} from "@ngx-translate/core";
import { AddLeaveFormComponent } from 'src/app/core/components/add-leave-form/add-leave-form.component';
import { MatDialog } from '@angular/material/dialog';
import { AssignLeaveFormComponent } from 'src/app/core/components/assign-leave-form/assign-leave-form.component';
import { SpacesService } from 'src/app/core/services/spaces.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { ToggleSwitchComponent } from 'src/app/core/inputs/toggle-switch.component';

@Component({
  selector: 'leaves-list',
  standalone: true,
  imports: [CommonModule, NotFoundComponent, LoadingComponent, TranslateModule,FormsModule,ToggleSwitchComponent],
  templateUrl: './leaves-list.component.html',
  styleUrls: ['./leaves-list.component.scss']
})
export class LeavesListComponent implements OnInit, OnDestroy {
  leaveSystem: any;
  selectedLeave:any
  spaceConfiguration: any;
search($event: any) {
throw new Error('Method not implemented.');
}
  hrService = inject(HrEmployeesService);
  leaveTypes: any = [];
  source$: Subscription;
  loading = true;
  constructor(private dialog: MatDialog ,private service :LeavesRequestsService , private spacesService:SpacesService , private alert:AlertService){}
  ngOnInit() {
    this.getPayrollCycle();
    this.source$ = this.service.list$.subscribe((res: any) => {
      this.leaveTypes = res.data;
      this.loading = false;
    });
  }
 
  
  getPayrollCycle() {
    this.hrService.getPayrollCycle().subscribe({
      next: (res: any) => {
        this.spaceConfiguration = res.data;
        this.leaveSystem = res.data.leaveSystem;

      }
    });
  }
  updateLeaveSystem(value: any) {
    let data = {
      leaveSystem: value,
      fromDay : this.spaceConfiguration.fromDay,
      toDay : this.spaceConfiguration.toDay,
      crossMonth : this.spaceConfiguration.crossMonth
    }
    this.spacesService.updateSpaceConfiguration(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('space_configuration_updated')
      }
    });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
  }

  addLeave(leave?:any) {
    this.selectedLeave = null
    if(leave){
      this.selectedLeave = leave
    }
    let dialogRef = this.dialog.open(AddLeaveFormComponent, {
      width: '550px',
      data:this.selectedLeave
    });
  }
  assignLeave() {
    let dialogRef = this.dialog.open(AssignLeaveFormComponent, {
      panelClass: 'medium-dialog'
    });
  }
}
