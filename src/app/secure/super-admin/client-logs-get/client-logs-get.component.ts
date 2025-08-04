import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { CreateWorkInfoComponent } from '../../user/hr/employee/forms-component/create-work-info/create-work-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { SpacesService } from 'src/app/core/services/super-admin/spaces.service';
import { LoadingComponent } from "../../../core/components/loading.component";
import { ArabicDatePipe } from "../../../core/pipes/arabic-date.pipe";
import { NotFoundComponent } from "../../../core/components/not-found.component";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'client-logs-get',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    LoadingComponent,
    ArabicDatePipe,
    NotFoundComponent
],
  templateUrl: './client-logs-get.component.html',
  styleUrls: ['./client-logs-get.component.scss']
})
export class ClientLogsGetComponent {

  form: any;
  formData: any;
loading: any;
logs: any;
url = environment.imageUrl;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateWorkInfoComponent>,
    private service:SpacesService,
    private alert:AlertService,
  ) {}

  ngOnInit(){
    this.getLogs()
  }
  getLogs(){
    this.loading = true
    this.service.getLogs(this.data.space).subscribe((res:any) => {
      console.log(res)
      this.logs = res.data
      this.loading=false
    })
  }
  close(){
    this.dialogRef.close()
  }
  deleteLog(id: any) {

    this.service.deleteLog(id).subscribe((res:any)=>{
      if(res.success){
        this.alert.showAlert('success')
        this.getLogs()
      }
    })
  }
}
