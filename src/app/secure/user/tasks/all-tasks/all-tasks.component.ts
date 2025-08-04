import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AllTasksFilterComponent} from "./all-tasks-filter/all-tasks-filter.component";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";
import {SortingComponent} from "../../../../core/filters/sorting.component";
import {NgxPaginationModule} from "ngx-pagination";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {TaskVoteProgressComponent} from "../../../../core/components/task-vote-progress.component";
import {RateComponent} from "../../../../core/components/rate.component";
import {TaskOverdueComponent} from "../../../../core/components/task-overdue.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import * as XLSX from "xlsx";
import {AllTasksService} from "../../../../core/services/all-tasks.service";
import {Router, RouterModule} from "@angular/router";
import {TaskStatusComponent} from "../../../../core/components/task-status.component";
import { ConvertMinutesPipe } from 'src/app/core/pipes/convert-minutes.pipe';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from 'src/app/secure/shared/task-details/task-details.component';
import { PropertyTypes } from 'src/app/core/enums/propertyTypes';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'all-tasks',
  standalone: true,
  imports: [ConvertMinutesPipe,CommonModule, AllTasksFilterComponent, LayoutWithFiltersComponent, MatCheckboxModule, TranslateModule, SortingComponent, NgxPaginationModule, PriorityComponent, UserImageComponent, MatTooltipModule, ArabicDatePipe, TaskVoteProgressComponent, RateComponent, TaskOverdueComponent, NotFoundComponent, LoadingComponent, RouterModule, TaskStatusComponent],
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.scss']
})
export class AllTasksComponent implements OnInit {
  spaceId = localStorage.getItem('space-id');
  url = environment.apiUrl;
  tasks!: any[];
  meta: any;
  loading = true;
  allChecked = false;
  selectedTasks: any = [];
  selectedTasksToHandover = [];
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  answersTypes = enumToArray(PropertyTypes)
taskAnswers: any[] = [];
  constructor(public service: AllTasksService, private elm: ElementRef , private dialog: MatDialog, private router: Router) {
  }
  openDetails(item:any){
    this.router.navigate([], {
      queryParams: { id: item.taskId },
      queryParamsHandling: 'merge',
    });

    let dialogRef = this.dialog.open(TaskDetailsComponent,{
      data: { task: item.taskId || item},
      panelClass: 'task-details-dialog',
    })
    dialogRef.afterClosed().subscribe((res:any) => {
      // this.getTasks()
    })
  }
  ngOnInit(): void {
    this.service.selectedTasksToHandover.subscribe(res => this.selectedTasksToHandover = res);
    this.service.tasks$.subscribe(res => {
      this.tasks = res;
      this.checkAllCheckedTasks();
    });
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    if (this.tasks?.length == 0) {
      this.service.search.next('');
    }
  }

  sort(value: any, direction: any) {
    this.service.page.next(1)
    this.service.orderKey.next(value)
    this.service.orderDirection.next(direction)
    this.getTasks()
  }

  getTasks() {
    this.service.hasChanged.next(true);
    this.tasks = [];
  }

  selectAllTasks($event: any) {
    this.allChecked = true;
    this.tasks.forEach(task => {
      if (task.taskStateId == 1 || task.taskStateId == 3 || task.taskStateId == 7) {
        this.selectTask($event, task)
      }
    })
  }

  selectTask($event: any, task: any) {
    if ($event.checked) {
      task.isSelected = true;
      this.getSelectedTasks()

    } else {
      this.allChecked = false;
      this.removeSelectedTasks(task);
      task.isSelected = false;
    }
    this.checkAllCheckedTasks();
  }

  getSelectedTasks() {
    this.selectedTasks = this.tasks.filter((task: any) => {
      return task.isSelected
    });
    let arr: any = [];
    this.selectedTasks = this.selectedTasks.filter((task: any) => {
      return !this.selectedTasksToHandover.find((_task: any) => task.taskId == _task.taskId);
    });
    this.service.selectedTasksToHandover.next(arr.concat(this.selectedTasksToHandover, this.selectedTasks));
  }

  removeSelectedTasks(task: any) {
    let newArr = this.selectedTasksToHandover.filter((_task: any) => {
      return task.taskId != _task.taskId
    });
    this.service.selectedTasksToHandover.next(newArr);
  }

  checkAllCheckedTasks() {
    let selectedLength = 0;
    let canBeSelected = 0;
    this.tasks.forEach((task: any) => {
      if (task.isSelected) {
        selectedLength++;
      }
      if (task.taskStateId == 1 || task.taskStateId == 3 || task.taskStateId == 7) {
        canBeSelected++
      }
    });
    this.allChecked = selectedLength == canBeSelected;
  }

  changePage($event: any) {
    this.service.page.next($event);
    this.getTasks();
  }

  limitChanged(e: any) {
    this.service.page.next(1);
    this.service.limit.next(e);
    this.getTasks();
  }

  exportToExcel() {
    /* pass here the table id */
    let element = this.elm.nativeElement.querySelector('#tasks');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'tasks.xlsx');
  }

  trackBy(index: any, item: any) {
    return item.taskId;
  }

  getTaskProps(taskId:any) {
    this.service.getTaskProps(taskId).subscribe((res:any) => {
      if(res.success){
        this.taskAnswers = res.data
        console.log(this.taskAnswers);

        this.openDialog()
      }
    })
  }

    openDialog(): void {
      this.dialog.open(this.dialogTemplate,{
        panelClass: 'users-answers-dialog',
        width:'900px',
        maxHeight:'90vh',
      });
    }

    closeDialog(){
      this.dialog.closeAll()
    }
}
