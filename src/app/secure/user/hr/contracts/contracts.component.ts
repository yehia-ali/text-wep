import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {ContractsService} from "../../../../core/services/contracts.service";
import {SearchComponent} from "../../../../core/filters/search.component";
import {TranslateModule} from "@ngx-translate/core";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {RateComponent} from "../../../../core/components/rate.component";
import {RepetitionComponent} from "../../../../core/components/repetition.component";
import {RouterLink} from "@angular/router";
import {TaskOverdueComponent} from "../../../../core/components/task-overdue.component";
import {TaskStatusComponent} from "../../../../core/components/task-status.component";
import {TaskVoteProgressComponent} from "../../../../core/components/task-vote-progress.component";
import {TimeLeftComponent} from "../../../../core/components/time-left.component";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {enumToArray} from "../../../../core/functions/enum-to-array";
import {EmploymentStatus} from "../../../../core/enums/employment-status";
import {EmploymentType} from "../../../../core/enums/employment-type";
import {ContractFormComponent} from "../../../../core/components/contract-form/contract-form.component";
import {MatDialog} from "@angular/material/dialog";
import {DepartmentsComponent} from "../../../../core/filters/departments.component";
import {ContractTypeComponent} from "../../../../core/filters/contract-type.component";
import {ContractStatusComponent} from "../../../../core/filters/contract-status.component";

@Component({
  selector: 'contracts',
  standalone: true,
  imports: [CommonModule, LayoutWithFiltersComponent, SearchComponent, TranslateModule, LoadingComponent, NgxPaginationModule, NotFoundComponent, PriorityComponent, RateComponent, RepetitionComponent, RouterLink, TaskOverdueComponent, TaskStatusComponent, TaskVoteProgressComponent, TimeLeftComponent, UserImageComponent, ArabicDatePipe, DepartmentsComponent, ContractTypeComponent, ContractStatusComponent],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent {
  service = inject(ContractsService)
  dialog = inject(MatDialog)
  contracts: any[] = [];
  meta: any;
  status = enumToArray(EmploymentStatus)
  types = enumToArray(EmploymentType)

  constructor() {
    this.service.list$.subscribe(res => {
      this.meta = this.service.meta.value;
      this.contracts = res
      console.log(res)
    });
  }

  contractDetails(contract: any) {
    this.dialog.open(ContractFormComponent, {
      panelClass: 'create-task-dialog',
      data: {
        isEdit: true,
        contract
      }
    })
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
