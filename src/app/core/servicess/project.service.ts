import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";
import {environment} from "../../../environments/environment";
import {Project} from "../interfaces/project";
import TimeLeft from "../functions/time-left";
import {WorkingHoursService} from "../services/working-hours.service";

@Injectable({
    providedIn: 'root'
})
export class ProjectService extends WorkingHoursService {
    projects = new BehaviorSubject<any>([]);
    allProjects = new BehaviorSubject<any>([]);
    currentPage = new BehaviorSubject(1);
    currentPageValue = 1;
    meta = new BehaviorSubject<any>('');
    projectMembers = new BehaviorSubject<any>([]);
    hierarchy = new BehaviorSubject<any>([]);
    hierarchyValue: any = [];
    projectDetailsReport = new BehaviorSubject<any>({});

    constructor(private http: HttpClient, public arabicNumbers: ArabicNumbersPipe) {
        super();
        this.currentPage.subscribe(res => this.currentPageValue = res)
        this.hierarchy.subscribe(res => this.hierarchyValue = res)
    }

    getProjects(search?: string) {
      const apiUrl = `${environment.apiUrl}api/Projects/GetMyProjects`;
      const limit = 15;
      const page = this.currentPageValue;

      const queryParams = new URLSearchParams({
          limit: limit.toString(),
          page: page.toString()
      });

      if (search) {
          queryParams.append('search', search);
      }

      return this.http.get(`${apiUrl}?${queryParams.toString()}`).pipe(
          map((res: any) => {
              let projects: Project[] = res.data.items;
              projects.forEach((project: Project) => {
                  TimeLeft(project);
                  project.isCreator = project.projectCreatorId == +localStorage.getItem('id')!;
              });
              this.projects.next(projects);
              this.meta.next({
                  pageSize: res.data.pageSize,
                  totalItems: res.data.totalItems,
                  totalPages: res.data.totalPages,
                  totalUnSeen: res.data.totalUnSeen,
                  currentPage: res.data.currentPage
              });
              return projects;
          })
      );
  }


    getAllProjects() {
        return this.http.get(`${environment.apiUrl}api/Projects/GetMyProjects`).pipe(map((res: any) => {
            let projects: Project[] = res.data.items;
            this.allProjects.next(projects)
            return projects;
        }));
    }

    getProjectMembers(id: number) {
        return this.http.get(`${environment.apiUrl}api/Projects/GetProjectMembers?id=${id}`).pipe(map((res: any) => {
            this.projectMembers.next(res.data.items);
            return res;
        }));
    }

    getProjectDetails(id: any) {
        return this.http.get(`${environment.apiUrl}api/Projects/GetProjectDetails?id=${id}`).pipe(map((res: any) => {
            let project = res.data;
            this.getProjectReport(id).subscribe(report => {
                project.workingHours = {}
                this.workingHours(project.workingHours, report?.workingHours.required, report?.workingHours.actual);
                this.projectDetailsReport.next(report)
            });
            return project;
        }));
    }

    getProjectReport(id: any) {
        return this.http.get(`${environment.apiUrl}api/Tasks/GetProjectTaskReport?projectId=${id}`).pipe(map((res: any) => {
            return res.data;
        }));
    }

    reassign(data: any) {
        return this.http.post(`${environment.apiUrl}api/Projects/Reassign`, data)
    }

    createProject(data: any) {
        return this.http.post(`${environment.apiUrl}api/Projects/Create`, data);
    }

    editProject(data: any) {
        return this.http.put(`${environment.apiUrl}api/Projects/Update`, data);
    }

    getHierarchy(projectId: number, parentTaskGroupId = '', index: number = 0) {
        return this.http.get(`${environment.apiUrl}api/TaskGroups/GetMyChildTaskGroups?projectIds=${projectId}&parentTaskGroupId=${parentTaskGroupId}`).pipe(map((res: any) => {
            let tasks = res.data.items;

            // to remove existing tasks from the new tasks
            tasks = tasks.filter((task: any) => {
                return !this.hierarchyValue.find((oldTask: any) => task.id == oldTask.id);
            });

            // to make the new tasks expandable if possible
            tasks.forEach((task: any) => {
                task.expand = true;
                task.margin = (task.depthLevel * 5 || 5) + 'rem';
            });

            if (parentTaskGroupId) {
                // to make the clicked task collapsable
                this.hierarchyValue[index].expand = false;
                this.hierarchyValue[index].haveSubTasks = true;

                // to add the new tasks to the hierarchy array
                this.hierarchyValue.splice(index + 1, 0, ...tasks);
                this.hierarchy.next(this.hierarchyValue);
            } else {
                this.hierarchy.next([...tasks, ...this.hierarchyValue]);
            }
            return tasks;
        }));
    }


    deleteProject(id: number) {
        return this.http.put(`${environment.apiUrl}api/Projects/Delete`, {id})
    }
}
