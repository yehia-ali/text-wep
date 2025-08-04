import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UploadImageModule } from '../../../../../core/components/upload-image/upload-image.module';
import { InputLabelComponent } from '../../../../../core/inputs/input-label.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { SearchComponent } from '../../../../../core/filters/search.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { NotFoundComponent } from "../../../../../core/components/not-found.component";
import { MatDialog } from '@angular/material/dialog';
import { CreateWorkInfoComponent } from '../forms-component/create-work-info/create-work-info.component';
import { ArabicDatePipe } from "../../../../../core/pipes/arabic-date.pipe";
import { LoadingComponent } from "../../../../../core/components/loading.component";
import { ConfirmationMessageComponent } from 'src/app/core/dialogs/confirmation-message.component';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'work-info',
  templateUrl: './work-info.component.html',
  standalone: true,
  styleUrls: ['./work-info.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    UploadImageModule,
    InputLabelComponent,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    SearchComponent,
    RouterModule,
    CommonModule,
    NotFoundComponent,
    ArabicDatePipe,
    LoadingComponent
],
})
export class WorkInfoComponent {
  isAdmin: boolean;
  ganders: readonly any[] | null;
  searchValue: any;
  allWorkInfo: any[] = [];
  workInfo: any;
  company: any;
  employeeId:any = this.route.snapshot.params['id']
  loading = false;

  constructor(private service : HrEmployeesService , private dialog : MatDialog , private route : ActivatedRoute , private alert:AlertService) {}

  ngOnInit(){
    this.getAllWorkInfo()
  }

  getAllWorkInfo() {
    const params ={
      UserId:this.employeeId,
      search:this.searchValue,
    }
    this.loading = true
    this.service.getUserWorkInfo(params).subscribe((res:any) => {
      this.allWorkInfo = res.data
      this.loading = false
    })
  }

  addWorkInfo(){
    const dialogRef = this.dialog.open(CreateWorkInfoComponent, {
      width: '600px',
      panelClass: 'visible-dialog-container',
      data: {
        employeeId: this.employeeId,
        editMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllWorkInfo();
      }
    });
  }

  search($event: any) {
    this.searchValue = $event;
    this.getAllWorkInfo();
  }

  editWorkInfo(workInfo:any){
    const dialogRef = this.dialog.open(CreateWorkInfoComponent, {
      width: '600px',
      panelClass: 'visible-dialog-container',
      data: {
        workInfo: workInfo,
        employeeId:this.employeeId,
        editMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getAllWorkInfo();
      }
    });
  }

  deleteWorkInfo(id:any){
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      autoFocus: false,
      data: {
        message: 'delete_workInfo',
        btn_name: "delete",
        classes: 'bg-primary white'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.service.deleteWorkInfo(id).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('work_info_deleted_success');
            this.getAllWorkInfo();
          }
        })
      }
    });
  }
}
