import { FormsModule } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {RouterLink} from "@angular/router";
import {TimeLeftComponent} from "../../../../core/components/time-left.component";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {InfoSidebarComponent} from "../../../../core/components/info-sidebar.component";
import {MatMenuModule} from "@angular/material/menu";
import {Project} from "../../../../core/interfaces/project";
import {ProjectMember} from "../../../../core/interfaces/project-member";
import {ProjectService} from "../../../../core/servicess/project.service";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../../../core/services/alert.service";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ProjectStatusComponent} from "../../../../core/components/project-status.component";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {SelectUserDialogComponent} from "../../../../core/components/select-user-dialog/select-user-dialog.component";
import {CreateProjectComponent} from "../../../../core/components/create-project/create-project.component";
import { ArabicNumbersPipe } from "../../../../core/pipes/arabic-numbers.pipe";
import { SearchComponent } from "../../../../core/filters/search.component";

@Component({
  selector: 'list',
  standalone: true,
  imports: [FormsModule, CommonModule, ArabicDatePipe, LayoutComponent, LoadingComponent, NgxPaginationModule, NotFoundComponent, PriorityComponent, RouterLink, TimeLeftComponent, TranslateModule, UserImageComponent, InfoSidebarComponent, MatMenuModule, MatTooltipModule, ProjectStatusComponent, ArabicNumbersPipe, SearchComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  searchValue: any;
  projects: any[] = []
  loading = true;
  meta: any;
  open = false;
  members: ProjectMember[] = [];
  isCreator = false;
  projectId!: number;
  selectedProject!: Project;
  limit = 15;

  constructor(private service: ProjectService, private dialog: MatDialog, private alert: AlertService) {
  }
  addProject() {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      panelClass: 'create-task-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getProjects();
        this.searchValue = null;
      }
    });
  }
  search($event: any) {
    this.searchValue = $event;
    this.getProjects()
  }
  changeLimit(){
    this.meta.pageSize = this.limit
    setTimeout(() => {
      this.service.projects.subscribe(res => {
        this.projects = res;

        // to stop the loading if there is tasks
        if (this.projects.length > 0) {
          this.loading = false;
        }
      });
      this.getProjects()
    }, 500);
  }
  ngOnInit(): void {
    this.service.projectMembers.subscribe(res => {
      this.members = res;
    })
    this.service.meta.subscribe(res => this.meta = res);

    this.service.projects.subscribe(res => {
      this.projects = res;

      // to stop the loading if there is tasks
      if (this.projects.length > 0) {
        this.loading = false;
      }
    });
    if (this.projects.length == 0) {
      this.getProjects();
    }

  }

  getProjects() {
    this.loading = true;
    this.service.getProjects(this.searchValue).subscribe(() => this.loading = false);
    console.log(this.meta)
  }

  getMembers(id: number, isCreator: boolean) {
    this.projectId = id;
    this.isCreator = isCreator;
    this.open = false;
    this.service.getProjectMembers(id).subscribe((res: any) => {
      this.open = true
    })
  }

  reassignMembers() {
    let dialogRef = this.dialog.open(SelectUserDialogComponent, {
      panelClass: 'select-users-dialog',
      data: {
        selectedUsers: this.members,
        multi: true,
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res?.changed && res?.users.length > 0) {
        const data = {
          projectId: this.projectId,
          assigneeIds: res.users.map((user: any) => user.id)
        }
        this.service.reassign(data).subscribe(() => {
          this.alert.showAlert('members_reassigned')
          this.service.getProjectMembers(this.projectId).subscribe()
        })
      }
    })
  }

  deleteProject() {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'small-dialog',
      data: {
        id: this.projectId,
        btn_name: "confirm",
        classes: 'bg-primary white',
        message: "delete_project"
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteProject(this.projectId).subscribe((_res: any) => {
          if (_res.success) {
            this.alert.showAlert('project_deleted')
            this.getProjects();
          }
        })
      }
    })
  }

  editProject() {
    this.dialog.open(CreateProjectComponent, {
      panelClass: 'create-task-dialog',
      data: {
        edit: true,
        project: this.selectedProject
      }
    })
  }

  changeStatue(projectState: any) {
    const data = {
      id: this.selectedProject.id,
      title: this.selectedProject.title,
      description: this.selectedProject.description,
      definitionOfDone: this.selectedProject.definitionOfDone,
      endDate: this.selectedProject.endDate,
      priority: this.selectedProject.priority,
      projectState
    }
    this.service.editProject(data).subscribe(() => {
      this.alert.showAlert('project_status_changed')
      this.getProjects();
    })
  }

  changePage($event: any) {
    this.service.currentPage.next($event);
    this.getProjects();
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
}
