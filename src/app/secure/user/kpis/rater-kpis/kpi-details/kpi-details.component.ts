import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { KpiRateFormComponent } from 'src/app/core/components/kpi-rate-form/kpi-rate-form.component';
import { EvaluationFrequency } from 'src/app/core/enums/evaluation-frequency';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { KpisService } from 'src/app/core/services/kpis.service';

@Component({
  selector: 'kpi-details',
  templateUrl: './kpi-details.component.html',
  styleUrls: ['./kpi-details.component.scss']
})
export class KpiDetailsComponent {
  kpiId = this.route.snapshot.params['id'];
  kpiDetails:any
  loading = true
  achieved:any
  historyIsOpen: boolean = false;
  historyloading: boolean = true;
  itemLogs: any;
  enLanguage: any = localStorage.getItem('language');
  isCurrentDate = false;
  evaluationfrequency = enumToArray(EvaluationFrequency)
  constructor(
    private route:ActivatedRoute,
    private service:KpisService,
    private dialog:MatDialog,
  ){
  }

  ngOnInit(){
    this.getKpiDetails()
  }

  getKpiDetails(){
    this.loading = true
    this.service.getKpiDetailsById(this.kpiId).subscribe((res:any) => {
      this.kpiDetails = res.data
      this.kpiDetails.kpi = true
      this.loading = false
      this.isCurrentDate = new Date(this.kpiDetails.dateTo) >= new Date() ? false : true
    })
  }

    addRate() {
      let dialogRef  = this.dialog.open(KpiRateFormComponent, {
        width: '400px',
        data: {
          id: this.kpiId,
          target: this.kpiDetails.target || 0,
          valueType: this.kpiDetails.kpiValueType || 0,
        }
      })

      dialogRef.afterClosed().subscribe((res) => {
        if(res){
          this.getKpiDetails()
        }
      })
    }

    getLogs(itemId: any) {
      this.historyloading = true;
      this.historyIsOpen = false;
      let params = new HttpParams().set('ObjectId', itemId).set('kpiHistoryRefrance', 4);
      this.service.getKpisHestory(params).subscribe((res: any) => {
        this.historyloading = false;
        this.historyIsOpen = true;
        this.itemLogs = res.data;
      });
    }

}
