import { SelectUserComponent } from 'src/app/core/components/select-user.component';
import { NotFoundComponent } from './../../../../core/components/not-found.component';
import { Component, ViewChild } from '@angular/core';
import { LayoutComponent } from "../../../../core/components/layout.component";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KanbanBoardService } from 'src/app/core/service/kanban-board.service';
import { HttpParams } from '@angular/common/http';
import { ArabicDatePipe } from "../../../../core/pipes/arabic-date.pipe";
import { UserWithImageComponent } from "../../../../core/components/user-with-image/user-with-image.component";
import { Router, RouterModule } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { SetActualTimeComponent } from 'src/app/core/components/set-actual-time.component';
import { UserNavbarComponent } from 'src/app/core/components/user-navbar/user-navbar.component';
import { PriorityComponent } from 'src/app/core/components/priority.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchComponent } from "../../../../core/filters/search.component";
import { PriorityFilterComponent } from "../../../../core/filters/priority-filter.component";
import { LoadingComponent } from "../../../../core/components/loading.component";
import { DateRangeComponent } from "../../../../core/components/date-range/date-range.component";
import { TaskStatusComponent } from "../../../../core/filters/task-status.component";
import { ProjectsComponent } from "../../../../core/filters/projects.component";
import { SpaceUsersComponent } from "../../../../core/filters/space-users.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RolesService } from 'src/app/core/services/roles.service';
import { TaskDetailsComponent } from 'src/app/secure/shared/task-details/task-details.component';

@Component({
  selector: 'kanban-board',
  templateUrl: './kanban-board.component.html',
  standalone: true,
  styleUrls: ['./kanban-board.component.scss'],
  imports: [MatSlideToggleModule, RouterModule, NotFoundComponent, MatTooltipModule, PriorityComponent, UserNavbarComponent, LayoutComponent, CdkDropList, CdkDrag, CommonModule, TranslateModule, ArabicDatePipe, UserWithImageComponent, RouterModule, SearchComponent, PriorityFilterComponent, LoadingComponent, DateRangeComponent, TaskStatusComponent, ProjectsComponent, SelectUserComponent]
})
export class KanbanBoardComponent {
  adminView = false;
  @ViewChild('projectsFilter') projectsComponent!: ProjectsComponent;
  @ViewChild('priorityFilter') PriorityComponent!: PriorityFilterComponent;
  @ViewChild('statusFilter') TaskStatusComponent!: TaskStatusComponent;
  @ViewChild('dateFilter') DateRangeComponent!: DateRangeComponent;
  @ViewChild('searchFilter') SearchComponent!: SearchComponent;
  @ViewChild('userFilter') SelectUserComponent!: SelectUserComponent;

  startDateFrom: any
  startDateTo: any
  endDateFrom: any
  endDateTo: any
  selectedItem: any = null
  page = 1;
  limit = 30;
  userId: any = localStorage.getItem('id');
  loading: any;
  todo: any[] = []
  completed: any[] = []
  inProgress: any[] = []
  overdue: any[] = []
  draft: any[] = []
  cancelled: any[] = []
  waitingForApprove: any[] = []
  rejected: any[] = []
  isAtBottom: boolean = false;

  moreTasksStatus = true;
  totalItems: any;
  searchValue: any;
  tskStatus: any
  taskStatus: any[] = [];
  projects: any[] | any = [];
  priority: any;
  cleanFilters: boolean;
  assignees: any[] = [];
  creators: any[] = [];
  constructor(
    public service: KanbanBoardService,
    private alert: AlertService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    public role: RolesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getTasks()
    const kanbanLayout = document.querySelectorAll('.example-list');
    if (kanbanLayout) {
      kanbanLayout.forEach((list: any) => {
        list.addEventListener('scroll', this.onElementScroll.bind(this))
      });
    }
  }
  onElementScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollTopRounded = Math.round(element.scrollTop);
    const clientHeightRounded = Math.round(element.clientHeight);
    const scrollHeightRounded = Math.round(element.scrollHeight);
    if ((scrollHeightRounded - scrollTopRounded == clientHeightRounded)) {
      this.getMoreTasks()
    }
  }
  getMoreTasks() {
    if (this.moreTasksStatus) {
      this.page += 1
      this.getTasks()
    }
  }
  // scroll(){
  //   let document.getElementById('kanban-layout')
  // }
  getTasks() {
    this.loading = true
    let params = new HttpParams()
      .set('page', this.page)
      .set('limit', this.limit)
      .set('userId', this.userId);
    if (this.searchValue) {
      params = params.set('search', this.searchValue)
    }
    if (this.startDateFrom) {
      params = params.set('startDateFrom', this.startDateFrom)
    }
    if (this.startDateTo) {
      params = params.set('startDateTo', this.startDateTo)
    }
    if (this.endDateFrom) {
      params = params.set('endDateFrom', this.endDateFrom)
    }
    if (this.endDateTo) {
      params = params.set('endDateTo', this.endDateTo)
    }
    if (this.priority) {
      params = params.set('priorities', this.priority)
    }
    if (this.taskStatus && this.taskStatus.length > 0) {
      this.taskStatus.forEach((status: any) => {
        params = params.append('states', status);
      });
    }
    if (this.projects && this.projects.length > 0) {
      this.projects.forEach((project: any) => {
        params = params.append('projectIds', project);
      });
    }
    if (this.creators && this.creators.length > 0) {
      this.creators.forEach((creator: any) => {
        params = params.append('creators', creator.id);
      });
    }
    if (this.assignees && this.assignees.length > 0) {
      this.assignees.forEach((creator: any) => {
        params = params.append('assignees', creator.id);
      });
    }

    if (!this.adminView) {
      this.service.getUserTasks(params).subscribe((res: any) => {
        this.loading = false
        this.categorizeTasks(res.data.items);
        this.totalItems = res.data.totalItems
        if (this.page >= (this.totalItems / this.limit)) {
          this.moreTasksStatus = false
        } else {
          this.moreTasksStatus = true
        }

      });
    } else {
      this.service.getAllTasks(params).subscribe((res: any) => {
        this.loading = false
        this.categorizeTasks(res.data.items);
        this.totalItems = res.data.totalItems
        if (this.page >= (this.totalItems / this.limit)) {
          this.moreTasksStatus = false
        } else {
          this.moreTasksStatus = true
        }
      });
    }


  }

  categorizeTasks(tasks: any[]) {
    tasks.forEach((task: any) => {
      switch (task.taskStateId) {
        case 1:
          this.todo.push(task);
          break;
        case 2:
          this.completed.push(task);
          break;
        case 3:
          this.inProgress.push(task);
          break;
        case 4:
          this.overdue.push(task);
          break;
        case 5:
          this.draft.push(task);
          break;
        case 6:
          this.cancelled.push(task);
          break;
        case 7:
          this.waitingForApprove.push(task);
          break;
        case 8:
          this.rejected.push(task);
          break;
        default:
          console.warn(`Unknown task status ID: ${task.taskStatusId}`);
      }
    });
  }

  onItemSelected(item: any) {
    this.selectedItem = item
  }
  openDetails(item: any) {
    this.router.navigate([], {
      queryParams: { id: item.taskId },
      queryParamsHandling: 'merge',
    });

    let dialogRef = this.dialog.open(TaskDetailsComponent, {
      data: { task: item.taskId || item },
      panelClass: 'task-details-dialog',
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      // this.getTasks()
    })
  }
  drop(event: CdkDragDrop<string[]> | any) {
    if (!this.adminView) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {

        if (this.selectedItem.taskStateId == 1) {
          let data = {
            id: this.selectedItem.taskId,
            percentage: 0,
            actualTime: null
          };
          this.service.updateEstimate({ estimatedTime: this.selectedItem.expectedTime, id: this.selectedItem.taskId }).subscribe(() => {
            this.service.updateTaskProgress(data).subscribe((res: any) => {
              if (res.success) {
                this.alert.showAlert('success');
                transferArrayItem(
                  event.previousContainer.data,
                  event.container.data,
                  event.previousIndex,
                  event.currentIndex,
                );
                const movedItem = event.container.data[event.currentIndex];
                movedItem.taskStateId = 3;
              }
            });
          });
        } else if (this.selectedItem.taskStateId == 2 && !this.selectedItem.rate) {
          let data = {
            id: this.selectedItem.taskId,
            percentage: 0,
            actualTime: null
          };

          this.service.updateTaskProgress(data).subscribe((res: any) => {
            if (res.success) {
              this.alert.showAlert('success');
              transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
              );
              const movedItem = event.container.data[event.currentIndex];
              movedItem.taskStateId = 3;
              this.alert.showAlert('success');
            }
          });
        } else if (this.selectedItem.taskStateId == 3) {
          let isAnswered = false
          this.service.getProps(this.selectedItem.taskId).subscribe((res: any) => {
            if (res.data.length > 0) {
              isAnswered = res.data.every((item: any) => item.isAnswered == true);
            } else {
              isAnswered = true
            }

            if (isAnswered) {
              let dialogRef = this.dialog.open(SetActualTimeComponent, {
                panelClass: 'small-dialog',
                data: { task: this.selectedItem }
              });
              dialogRef.afterClosed().subscribe((res: any) => {
                if (res.success) {
                  this.alert.showAlert('success');
                  transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex,
                  );
                  this.alert.showAlert('success');
                  const movedItem = event.container.data[event.currentIndex];
                  movedItem.taskStateId = 2;
                }
              });
            } else {
              this.alert.showAlert('answer_questions_first', 'bg-danger')
            }
          })

        }
      }
    } else {
      this.alert.showAlert('not_allow_move_items', 'bg-warning')
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  search($event: any) {
    this.searchValue = $event
    this.resetLists()
  }
  resetLists() {
    this.page = 1;
    this.todo = []
    this.completed = []
    this.inProgress = []
    this.overdue = []
    this.draft = []
    this.cancelled = []
    this.waitingForApprove = []
    this.rejected = []
    this.getTasks()
  }
  changeEndDate($event: { startDate: any; endDate: any; }) {
    this.endDateFrom = this.datePipe.transform($event.startDate, 'yyyy-MM-dd')
    this.endDateTo = this.datePipe.transform($event.endDate, 'yyyy-MM-dd')
    this.resetLists()
  }
  changeStartDate($event: { startDate: any; endDate: any; }) {
    this.startDateFrom = this.datePipe.transform($event.startDate, 'yyyy-MM-dd')
    this.startDateTo = this.datePipe.transform($event.endDate, 'yyyy-MM-dd')
    this.resetLists()
  }
  changeTaskStatus($event: any) {
    this.taskStatus = $event
    this.resetLists()
  }

  changeAssignee($event: any) {
    this.assignees = $event
    this.resetLists()
  }
  changeCreator($event: any) {
    this.creators = $event
    this.resetLists()
  }

  changeProject($event: any) {
    this.projects = $event
    this.resetLists()
  }
  changePriority($event: any) {
    this.priority = $event
    this.resetLists()
  }
  resetFilters() {
    this.priority = null
    this.projects = []
    this.creators = []
    this.assignees = []
    this.taskStatus = []
    this.searchValue = null
    this.startDateFrom = null
    this.startDateTo = null
    this.endDateFrom = null
    this.endDateTo = null
    this.cleanFilters = true
    this.projectsComponent.selectedValue = []
    this.PriorityComponent.selectedValue = []
    this.TaskStatusComponent.selectedValue = []
    this.SelectUserComponent.selectedUsers = []
    this.DateRangeComponent.startDate = null
    this.DateRangeComponent.endDate = null
    this.SearchComponent.key = ''
    this.resetLists()
  }

  changeView($event: any, template = false) {
    if ($event.checked && template) {
      this.router.navigate(['/board/template']);
    } else {
      this.adminView = $event.checked
      this.resetLists()
    }
  }
}






