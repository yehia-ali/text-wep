import {Component, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateFilterComponent} from "../../../../../core/filters/date-filter.component";
import {IsOverdueComponent} from "../../../../../core/filters/is-overdue.component";
import {IsRatedComponent} from "../../../../../core/filters/is-rated.component";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PriorityFilterComponent} from "../../../../../core/filters/priority-filter.component";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {TaskVoteSortComponent} from "../../../../../core/components/task-vote-sort.component";
import {TaskStatusComponent} from "../../../../../core/filters/task-status.component";
import {TaskTypeComponent} from "../../../../../core/filters/task-type.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {TaskSentService} from "../../../../../core/services/task-sent.service";
import {SelectUserComponent} from "../../../../../core/components/select-user.component";
import {ProjectsComponent} from "../../../../../core/filters/projects.component";
import {CreateTaskComponent} from "../../../../../core/components/create-task/create-task.component";
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { CreateTaskService } from 'src/app/core/services/create-task.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import * as XLSX from "xlsx";
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'sent-filters',
  standalone: true,
    imports: [MatButtonModule ,CommonModule, DateFilterComponent, IsOverdueComponent, IsRatedComponent, MagicScrollDirective, MatCheckboxModule, PriorityFilterComponent, SearchComponent, TaskVoteSortComponent, TaskStatusComponent, TaskTypeComponent, TranslateModule, SelectUserComponent, ProjectsComponent , SplitButtonModule],
  templateUrl: './sent-filters.component.html',
  styleUrls: ['./sent-filters.component.scss']
})
export class SentFiltersComponent {

  emloyeesItems:any
  branchesItems:any
  selectedFile: any;
  uploadFile = false
  employeeMode:boolean
  url = environment.apiUrl;
  constructor(private elm: ElementRef ,private dialog : MatDialog , private createTaskService : CreateTaskService , private alert : AlertService ,  private translate: TranslateService, ){}
  service = inject(TaskSentService)
  showFilters = false;
  visibleFilters: any = {
    // creator: false || this.service.creatorValue.length > 0,
    priority: false || this.service.priority.value.length > 0,
    rate: true || this.service.rated.value,
    overdue: false || (this.service.isOverdue.value == true || this.service.isOverdue.value == false),
    project: false || this.service.project.value.length > 0,
    date: false || this.service.dateFrom.value || this.service.dateTo.value,
  }
  ngOnInit(){
    this.emloyeesItems = [
      {
        label: this.translate.instant('upload_branch_file'),
        command: () => this.selectFile(false),
      },
      {
        label: this.translate.instant('download_branche_template'),
        command: () => this.downloadFile(false),
      },
      {
        label: this.translate.instant('upload_employee_file'),
        command: () => this.selectFile(true),
      },
      {
        label: this.translate.instant('download_employee_template'),
        command: () => this.downloadFile(true),
      },
    ];
  }
  filtersArray = Object.keys(this.visibleFilters).map(filter => {
    return filter
  });

  filter() {
    this.service.filter();
  }

  unCheck(filter: any) {
    this.visibleFilters[filter] = !this.visibleFilters[filter];
  }

  @HostListener('document:click', ['$event']) documentClickEvent($event: MouseEvent) {
    this.showFilters = false;
  }
  createTask() {
    let ref = this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
    });
    ref.afterClosed().subscribe(() => {
      this.service.hasChanged.next(true);
    });
  }
  onSubmit(employeeMode:boolean) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    if(employeeMode){
      this.createTaskService.createBulkTaskByEmpCode(formData).subscribe((res:any) =>{
        if(res.success){
          this.alert.showAlert('success')
          this.service.hasChanged.next(true);
          this.uploadFile = true
          setTimeout(() => {
            this.uploadFile = false
          }, 0);
        }
      });
    }else{
      this.createTaskService.CreateBulkTaskByBrancheCode(formData).subscribe((res:any) =>{
        if(res.success){
          this.alert.showAlert('success')
          this.service.hasChanged.next(true);
          this.uploadFile = true
          setTimeout(() => {
            this.uploadFile = false
          }, 0);
        }
      });
    }
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!allowedTypes.includes(file.type)) {
        return;
      }
      this.selectedFile = file;
      setTimeout(() => {
        this.onSubmit(this.employeeMode)
      }, 0);
    }
  }

  downloadFile(employeeMode:boolean){
    let url:any
    if(employeeMode){
      url = this.url + 'api/TaskGroups/download-template'
    }else{
      url = this.url + 'api/TaskGroups/download-templateForBranch'
    }

    window.open(url , '_blank')
  }
  selectFile(employeeMode:boolean) {
    this.employeeMode = employeeMode;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }


      exportToExcel() {
        /* pass here the table id */
        let element = document.getElementById('tasks');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'sent-Tasks.xlsx');
      }


}
