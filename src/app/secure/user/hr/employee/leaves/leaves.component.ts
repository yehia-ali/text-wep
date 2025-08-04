import { Component } from '@angular/core';
import { UploadImageModule } from "../../../../../core/components/upload-image/upload-image.module";
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from "../../../../../core/filters/search.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../../../../core/components/loading.component";
import { NotFoundComponent } from "../../../../../core/components/not-found.component";
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssignLeaveFormComponent } from 'src/app/core/components/assign-leave-form/assign-leave-form.component';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';

@Component({
  selector: 'leaves',
  templateUrl: './leaves.component.html',
  standalone: true,
  styleUrls: ['./leaves.component.scss'],
  imports: [
    UploadImageModule,
    TranslateModule,
    SearchComponent,
    RouterModule,
    CommonModule,
    LoadingComponent,
    NotFoundComponent
  ]
})
export class LeavesComponent {

  isAdmin: boolean;
  searchValue: any;

  company: any;
  alLeaves: any
  loading = false;
  employeeId:any = this.route.snapshot.params['id']

  constructor(private service: HrEmployeesService  , private dialog : MatDialog , private route : ActivatedRoute , private alert:AlertService) { }

  ngOnInit() {
    this.getAllLeaves()
  }

  getAllLeaves() {
    this.loading = true
    this.service.getUserLeaveTypes(this.employeeId).subscribe((res: any) => {
      this.alLeaves = res.data
      this.loading = false
    })
  }

  leaveDialog(item?:any) {
    const dialogRef = this.dialog.open(AssignLeaveFormComponent, {
      width: '600px',
      panelClass: 'visible-dialog-container',
      data: {
        employeeId: this.employeeId,
        disableUser: true,
        leaveData:item || null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllLeaves();
      }
    });
  }

  search($event: any) {
    this.searchValue = $event;
    this.getAllLeaves()
  }
}
