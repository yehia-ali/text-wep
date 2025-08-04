import { Component } from '@angular/core';
import { UploadImageModule } from "../../../../../core/components/upload-image/upload-image.module";
import { InputLabelComponent } from "../../../../../core/inputs/input-label.component";
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from "../../../../../core/filters/search.component";
import { UserWithImageComponent } from "../../../../../core/components/user-with-image/user-with-image.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../../../../core/components/loading.component";
import { NotFoundComponent } from "../../../../../core/components/not-found.component";
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { AssignLeaveFormComponent } from 'src/app/core/components/assign-leave-form/assign-leave-form.component';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { ArabicDatePipe } from "../../../../../core/pipes/arabic-date.pipe";
import { PenaltyFormComponent } from '../forms-component/penalty-form/penalty-form.component';

@Component({
  selector: 'penalties',
  templateUrl: './penalties.component.html',
  standalone: true,
  styleUrls: ['./penalties.component.scss'],
  imports: [
    UploadImageModule,
    InputLabelComponent,
    TranslateModule,
    SearchComponent,
    UserWithImageComponent,
    RouterModule,
    CommonModule,
    LoadingComponent,
    NotFoundComponent,
    ArabicDatePipe
]
})
export class PenaltiesComponent {

  isAdmin: boolean;
  searchValue: any;

  company: any;
  allPenalties: any[] = [5]
  loading = false;
  employeeId:any = this.route.snapshot.params['id']

  constructor(private service: HrEmployeesService  , private dialog : MatDialog , private route : ActivatedRoute , private alert:AlertService) { }

  ngOnInit() {
    this.getAllPenalties()
  }

  getAllPenalties() {
    this.service.getAllPenalties(this.employeeId).subscribe((res: any) => {
      this.allPenalties = res.data
    })
  }

  addLeave() {
    const dialogRef = this.dialog.open(PenaltyFormComponent, {
      width: '300px',
      panelClass: 'visible-dialog-container',
      data: {
        employeeId: this.employeeId,
        disableUser: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllPenalties();
      }
    });
  }

  search($event: any) {
    this.searchValue = $event;
    this.getAllPenalties()
  }
}
