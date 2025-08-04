import { Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { KpisService } from 'src/app/core/services/kpis.service';
import { DatePipe } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { EvaluationFrequency } from 'src/app/core/enums/evaluation-frequency';

@Component({
  selector: 'rater-kpis-list',
  templateUrl: './rater-kpis-list.component.html',
  styleUrls: ['./rater-kpis-list.component.scss']
})
export class RaterKpisListComponent {

  ratedKpis = false
  searchValue: any;
  loading: any;
  itemsList: any[] = [];
  totalItems: any;
  limit: any = 15;
  page:any = 1
  evaluationfrequency = enumToArray(EvaluationFrequency)

  constructor(
    public service:KpisService,
    public datePipe:DatePipe,
    public alert:AlertService,
  ) {

  }

  ngOnInit(){
    this.getKpisList();
  }

  getKpisList() {
    this.loading = true;
    let params = new HttpParams().set('page' , this.page).set('limit' , this.limit).set('IsRated' , this.ratedKpis);
    if(this.searchValue){
      params = params.append('search', this.searchValue)
    }

    this.service.getRaterKpis(params).subscribe((res: any) => {
      this.loading = false;
      if(res.success){
        this.itemsList = res.data.items.map((item:any) => {
         return item
        });
        this.totalItems = res.data.totalItems;
      }
    })
  }

  search($event: any) {
    this.searchValue = $event;
    this.page = 1;
    this.getKpisList()
  }

  pageChanged($event: number) {
    this.page = $event
    this.getKpisList()
  }
  changeLimit() {
    this.page = 1
    this.getKpisList()
  }

}
