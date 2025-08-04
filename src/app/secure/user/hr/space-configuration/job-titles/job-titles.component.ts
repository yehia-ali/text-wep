import {Component, TemplateRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicDatePipe} from "../../../../../core/pipes/arabic-date.pipe";
import { SearchComponent } from "../../../../../core/filters/search.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabelComponent } from "../../../../../core/inputs/input-label.component";
import { InputErrorComponent } from "../../../../../core/inputs/input-error.component";
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'job-titles',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent],
  templateUrl: './job-titles.component.html',
  styleUrls: ['./job-titles.component.scss']
})
export class JobTitlesComponent {
  form:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  jobTitles: any = [];
  loading = false;
  constructor(private dialog: MatDialog ,private service :HrEmployeesService , private fb :FormBuilder , private alert : AlertService){}

  ngOnInit() {
    this.getAllJobTitles()
    this.form = this.fb.group({
      nameAr:['',Validators.required],
      nameEn:['' , Validators.required]
    })
  }

  getAllJobTitles(){
    this.loading = true
    let params = new HttpParams()
    this.service.getAllJobTitles(params).subscribe((res: any) => {
      this.jobTitles = res.data.items;
      this.loading = false;
    });
  }


  addJobTitle(): void {
    let ref = this.dialog.open(this.dialogTemplate,{
      width:'500px',
    });
    ref.afterClosed().subscribe(() => {
      this.form.reset()
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
  get f() {
    return this.form.controls;
  }

  search($event: any) {
    throw new Error('Method not implemented.');
  }

  createJobTitle() {
    if(this.form.valid){
      this.service.createJobTitle(this.form.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('job_title_created_success');
          this.getAllJobTitles()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }

}
