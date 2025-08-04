import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ProjectService } from 'src/app/core/servicess/project.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KpisService } from 'src/app/core/services/kpis.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-kpi-category-filter',
  standalone: true,
  templateUrl: './kpi-category-filter.component.html',
  styleUrls: ['./kpi-category-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, DropdownModule , TranslateModule]
})
export class KpiCategoryFilterComponent {
  @Input() selectedValue: any;
  @Output() valueChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() small = true;
  @Input() icon = true;

  itemsList:any = []

  constructor(private service: KpisService) { }

  ngOnInit(): void {
    this.getItemList()
  }

  getItemList(){
    let params = new HttpParams().set('limit' , 100).set('IsApproved' , 'true')
    this.service.getAllKpisCategory(params).subscribe((res:any) => {
      this.itemsList = res.data.items
    })
  }
  onChange() {
    const data = this.selectedValue.id
    this.valueChanged.emit(data);
  }
}
