import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { AlertService } from 'src/app/core/services/alert.service';
import { SubmitButtonComponent } from "../../../../../../core/components/submit-button.component";
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { CreateWorkInfoComponent } from '../create-work-info/create-work-info.component';
import { AllPenaltyTypesComponent } from "../../../../../../core/filters/all-penalty-types.component";
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'penalty-form',
  standalone: true,
  imports: [
    TranslateModule,
    MatButtonModule,
    SubmitButtonComponent,
    AllPenaltyTypesComponent
],
  templateUrl: './penalty-form.component.html',
  styleUrls: ['./penalty-form.component.scss'],
})
export class PenaltyFormComponent {

penaltyTypeId: any;


  constructor(
    private service: HrEmployeesService ,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateWorkInfoComponent>,
    private alert:AlertService,

  ) {}

  ngOnInit(): void {

  }
  addPenalty() {
    const data = new HttpParams()
      .set('employeeId', this.data.employeeId)
      .set('penaltyTypeId', this.penaltyTypeId);

    this.service.addPenalty(data).subscribe((res: any) => {
      if (res?.success) {
        this.alert.showAlert('penalty_added_success');
        this.dialogRef.close(true);
      } else {
        console.error('Error adding penalty:', res);
        this.alert.showAlert('penalty_add_failed');
      }
    });
  }


  changePenalty(event: string) {
    console.log(event)
    this.penaltyTypeId = event
  }
}
