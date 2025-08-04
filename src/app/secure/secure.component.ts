import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CreateTaskComponent} from "../core/components/create-task/create-task.component";
import {MatDialog} from "@angular/material/dialog";
import {CreateVoteComponent} from "../core/components/create-vote/create-vote.component";
import {CreateProjectComponent} from "../core/components/create-project/create-project.component";
import {LeaveFormComponent} from "./user/hr/leave-form/leave-form.component";
import {SpacesService} from "../core/services/spaces.service";
import {ShiftFormComponent} from "../core/components/shift-form/shift-form.component";
import {OvertimeFormComponent} from './user/hr/overtime/overtime-form/overtime-form.component';
import {EmailFormComponent} from "../core/components/email-form/email-form.component";
import {RolesService} from "../core/services/roles.service";
import {ContractFormComponent} from "../core/components/contract-form/contract-form.component";
import { EmoloyeeRateComponent } from '../core/components/emoloyee-rate/emoloyee-rate.component';

@Component({
  selector: 'secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss'],
})
export class SecureComponent implements OnInit {

  router = inject(Router);
  dialog = inject(MatDialog);
  spaceSer = inject(SpacesService);
  rolesSer = inject(RolesService);
  param: boolean = false
  ngOnInit() {
    let token = localStorage.getItem('token');
    let spaceId = localStorage.getItem('space-id');
    let isSuperAdmin = localStorage.getItem('is-super-admin');
    if (!token && !spaceId) {
      this.router.navigate(['/auth']);
    } else if (token && !spaceId && !isSuperAdmin) {
      this.router.navigate(['/welcome']);
    }

  }

  createTask() {
    const dialogRef  = this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      // Check if param is true and reopen the dialog
      // if (this.param === true) {
      //   this.reopenDialog();
      // }
    });

  }

  reopenDialog() {
    // Reopen the dialog after it has closed
    setTimeout(() => {
      this.dialog.open(CreateTaskComponent, {
        data: { exampleData: 'Reopened dialog' } // Pass any data if necessary
      });
    }, 0); // Delay to ensure the dialog fully closes before reopening
  }

  rateEmployee() {
    this.dialog.open(EmoloyeeRateComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
    });
  }

  createVote() {
    this.dialog.open(CreateVoteComponent, {
      panelClass: 'create-task-dialog',
    });
  }

  createProject() {
    this.dialog.open(CreateProjectComponent, {
      panelClass: 'create-task-dialog',
    });
  }

  createMeeting() {
    this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
      data: {
        isMeeting: true,
      },
    });
  }

  createLeave() {
    this.dialog.open(LeaveFormComponent, {
      width:'550px',
    });
  }

  createOvertime() {
    this.dialog.open(OvertimeFormComponent, {
      panelClass: 'create-task-dialog',
    });
  }

  createShift() {
    this.dialog.open(ShiftFormComponent, {
      panelClass: 'create-task-dialog',
      data: {
        isEdit: false
      }
    })
  }

  createEmail() {
    this.dialog.open(EmailFormComponent, {
      panelClass: 'create-task-dialog',
      data: {
        isEdit: false
      }
    })
  }

  createContract() {
    this.dialog.open(ContractFormComponent, {
      panelClass: 'create-task-dialog',
      data: {
        isEdit: false
      }
    })
  }
}
