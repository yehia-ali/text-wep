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
  selector: 'experience-levels',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, TranslateModule, ArabicDatePipe, SearchComponent, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent],
  templateUrl: './experience-levels.component.html',
  styleUrls: ['./experience-levels.component.scss']
})
export class ExperienceComponent {
  form:FormGroup
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  experiences: any = [];
  loading = false;
  constructor(private dialog: MatDialog ,private service :HrEmployeesService , private fb :FormBuilder , private alert : AlertService){}

  ngOnInit() {
    this.getAllexperience()
    this.form = this.fb.group({
      nameAr:  ['' , Validators.required],
      nameEn:  ['' , Validators.required]
    })
  }

  getAllexperience(){
    this.loading = true
    let params = new HttpParams()
    this.service.getAllWorkExp().subscribe((res: any) => {
      this.experiences = res.data;
      this.loading = false;
    });
  }


  openDialog(): void {
    this.dialog.open(this.dialogTemplate,{
      width:'500px',
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

  addExperience() {
    if(this.form.valid){
      this.service.createWorkExp(this.form.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('experience_created_success');
          this.getAllexperience()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }

}
