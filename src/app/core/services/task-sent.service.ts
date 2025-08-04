import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FiltersService} from "./filters.service";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {TaskSent} from "../interfaces/task-sent";
import {convertToUTC} from "../functions/convertToUTC";
import {ExpectedTime} from "../functions/expected-time";
import {TaskGroupAssignee} from "../interfaces/task-group-assignee";
import TimeLeft from "../functions/time-left";

@Injectable({
  providedIn: 'root'
})
export class TaskSentService extends FiltersService {
  sent$: Observable<TaskSent[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getSent().pipe(map((res: any) => res))));
  override userId = new BehaviorSubject<any>(null)
  userSent = new BehaviorSubject<any>(null);
  userName = new BehaviorSubject('')
  currentUser = localStorage.getItem('id');

  constructor(private http: HttpClient) {
    super();
  }

  getSent() {
    this.loading.next(true);
    const url = new URL(`${environment.apiUrl}api/TaskGroups/GetUserTaskGroups?isCollapsed=true`);
    url.searchParams.append('userId', this.userSent.value ? String(this.userSent.value) : String(this.currentUser))
    this.params(url);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false);
      let sent = res.data.items;
      let now = new Date().getTime();
      sent.forEach((task: TaskSent) => {
        let endDate = convertToUTC(task.endDate);
        task.isOverDue = endDate.getTime() - now < 0;
        ExpectedTime(task, task.expectedTime)
      });
      this.setMeta(res);
      return res.data.items;
    }));
  }

  getAssignees(id: any) {
    return this.http.get(`${environment.apiUrl}api/TaskGroups/GetAssignee?id=${id}`).pipe(map((res: any) => {
      let tasks = res.data.items;
      tasks.forEach((task: TaskGroupAssignee) => {
        TimeLeft(task);
      });
      return tasks;
    }));
  }

  getAllAssignees(params?:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/TaskGroups/GetAssignee` , {params}).pipe(map((res: any) => {
      return res.data
    }));
  }
  getTaskGroupAnswers(params?:HttpParams) {
    return this.http.get(`${environment.apiUrl}api/TaskGroups/GetTaskGroupAnswers` , {params}).pipe(map((res: any) => {
      return res
    }));
  }

  getReporters(id: any) {
    return this.http.get(`${environment.apiUrl}api/TaskGroupReporters/GetReporters?id=${id}`)
  }

  updateExpectedTime(data: any) {
    return this.http.put(`${environment.apiUrl}api/TaskGroups/UpdateExpectedTime`, data)
  }

  cancelTaskGroup(taskGroupId: number) {
    return this.http.put(`${environment.apiUrl}api/TaskGroups/Cancel`, {taskGroupId});
  }

  deleteTaskGroup(id: number) {
    return this.http.put(`${environment.apiUrl}api/TaskGroups/delete`, {id});
  }

  reassign(data: any) {
    return this.http.post(`${environment.apiUrl}api/TaskGroups/Reassign`, data);
  }

}
