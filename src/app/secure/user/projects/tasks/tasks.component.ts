import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {GlobalService} from "../../../../core/services/global.service";
import {ProjectService} from "../../../../core/servicess/project.service";
import {SubTask} from "../../../../core/interfaces/sub-task";
import {TaskSentService} from "../../../../core/services/task-sent.service";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {TaskGroupDetailsComponent} from "../../../../core/components/task-group-details.component";
import {CreateTaskComponent} from "../../../../core/components/create-task/create-task.component";

@Component({
  selector: 'tasks',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MatButtonModule, TranslateModule, MagicScrollDirective, ArabicDatePipe, LoadingComponent, NotFoundComponent, TaskGroupDetailsComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  id: any;
  projectTitle = '';
  hierarchy: SubTask[] = [];
  loading = true;
  assignees = [];
  reporters = [];

  constructor(private service: ProjectService, private route: ActivatedRoute, private dialog: MatDialog, private elm: ElementRef, private taskGroupDetailsSer: TaskSentService, private globalSer: GlobalService) {
  }

  ngOnInit(): void {
    this.service.hierarchy.subscribe(res => {
      this.hierarchy = res;
      this.projectTitle = res[0]?.projectTitle
    })
    this.id = this.route.snapshot.params['id'];
    this.getHierarchy()
  }

  expand(id: any, index: number) {
    this.hierarchy[index].disabled = true;
    this.service.getHierarchy(this.id, id, index).subscribe(res => {
      this.hierarchy[index].disabled = false;
    });
  }

  collapse(depth: number, i: number) {
    this.hierarchy[i].expand = true;
    let breakPoint = this.hierarchy.length;
    this.hierarchy = this.hierarchy.filter((task, index) => {
      if (index > i) {
        if (index < breakPoint) {
          if (task.depthLevel <= depth) {
            breakPoint = index;
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      } else {
        return true
      }
    });
    this.service.hierarchy.next(this.hierarchy);
  }

  getHierarchy() {
    this.loading = true;
    this.service.getHierarchy(this.id).subscribe(res => {
      this.loading = false;
      if (res.length > 0) {
        setTimeout(() => {
          let tasks = this.elm.nativeElement.querySelector('.hierarchy .tasks');
          let topSection = this.elm.nativeElement.querySelector('.hierarchy .top-section');
          tasks.style.height = `calc(100% - ${topSection.offsetHeight}px)`;
        }, 100)
      }
    });
  }

  createTask(parentTaskGroupId: number, index: number, title: string) {
    this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
      data: {
        projectId: this.id,
        parentTaskGroupId,
        isSubTask: true,
        taskTitle: title,
        index
      }
    })
  }

  createMainTask() {
    this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
      data: {
        projectId: this.id,
        mainTask: true,
      }
    })
  }

  // for sidebar
  selectedTask!: SubTask;
  open = false;

  openSidebar() {
    this.open = false;
    setTimeout(() => {
      this.open = true;
    }, 0);
    // this.taskGroupDetailsSer.getAssignees(this.selectedTask?.id).subscribe((res: any) => {
    //   this.assignees = res;
    //   this.open = true;
    // });
    this.taskGroupDetailsSer.getReporters(this.selectedTask?.id).subscribe((res: any) => {
      this.reporters = res.data.items;
    });
  }

  ngOnDestroy() {
    this.service.hierarchy.next([]);
  }
}
