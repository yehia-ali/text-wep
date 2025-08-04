import {Component, TemplateRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingComponent} from "../../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../../core/components/not-found.component";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicDatePipe} from "../../../../../core/pipes/arabic-date.pipe";
import { MatDialog, MatDialogModule,  } from '@angular/material/dialog';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabelComponent } from "../../../../../core/inputs/input-label.component";
import { InputErrorComponent } from "../../../../../core/inputs/input-error.component";
import { AlertService } from 'src/app/core/services/alert.service';
import { MatButtonModule } from '@angular/material/button';
import { EnglishTextDirective } from 'src/app/core/directives/english-text.directive';
import { ArabicTextDirective } from 'src/app/core/directives/arabic-text.directive';

@Component({
  selector: 'penalty-types',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, MatButtonModule, TranslateModule, ArabicDatePipe, MatDialogModule, FormsModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, ArabicTextDirective, EnglishTextDirective],
  templateUrl: './penalty-types.component.html',
  styleUrls: ['./penalty-types.component.scss']
})
export class PenaltyTypesComponent {
  form:FormGroup;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  penalties: any = [];
  loading = false;
  data: any = { action: 'add' }; // Add data property with default action
  constructor(private dialog: MatDialog ,private service :HrEmployeesService , private fb :FormBuilder , private alert : AlertService){}

  ngOnInit() {
    this.getAllPenaltyTypes()
    this.form = this.fb.group({

      name: ['' , Validators.required],
      nameAr:['' , Validators.required] ,
      deductionAmountFirstTime: [0 , [Validators.required, Validators.max(5)]],
      deductionAmountSecondTime: [0 , [Validators.required, Validators.max(5)]],
      deductionAmountThirdTime: [0 , [Validators.required, Validators.max(5)]],
      deductionAmountFourthTime: [0 , [Validators.required, Validators.max(5)]]
    })
  }

  getAllPenaltyTypes(){
    this.loading = true
    let params = new HttpParams()
    this.service.getAllPenaltiesType().subscribe((res: any) => {
      this.penalties = res.data;
      this.loading = false;
    });
  }


  openDialog(): void {
    this.data = { action: 'add' }; // Set action to add when opening dialog for new penalty
    this.form.reset(); // Reset form when adding new penalty
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

  addPenalty() {
    if(this.form.valid){
      this.service.addPenaltyType(this.form.value).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('penalty_type_created_success');
          this.getAllPenaltyTypes()
          this.closeDialog()
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }
  editPenalty(item: any) {
    this.data = { action: 'edit', item: item }; // Set action to edit and store item
    this.form.patchValue(item)
    this.dialog.open(this.dialogTemplate,{
      width:'500px',
    });
  }
  updatePenalty() {
    if(this.form.valid){
      const updateData = { ...this.form.value, id: this.data.item.id };
      this.service.updatePenaltyType(updateData).subscribe((res:any) => {
        if(res.success){
          this.alert.showAlert('penalty_type_updated_success');
          this.getAllPenaltyTypes();
          this.closeDialog();
        }
      })
    }else{
      this.form.markAllAsTouched()
      this.alert.showAlert('error' , 'bg-danger');
    }
  }
}
