import {Injectable} from '@angular/core';
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FiltersService} from "./filters.service";
import {AllTasks} from "../interfaces/all-tasks";

@Injectable({
  providedIn: 'root'
})
export class AllTasksService extends FiltersService {
  tasks$: Observable<AllTasks[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getTasks().pipe(map((res: any) => res))));

  selectedTasksToHandover = new BehaviorSubject([]);
  selectedTasksToHandoverValue = [];
  spaceId:any = localStorage.getItem('space-id');
  token:any = localStorage.getItem('token');
  constructor(private http: HttpClient) {
    super();
    this.selectedTasksToHandover.subscribe(res => this.selectedTasksToHandoverValue = res);
  }

  getTasks() {
    this.loading.next(true);
    const url = new URL(`${environment.apiUrl}api/Tasks/GetAllTasks`);
    this.params(url, 'all-tasks');
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false)
      let tasks = res.data.items;
      tasks.forEach((task: any) => {
        task.isSelected = this.selectedTasksToHandoverValue.find((_task: any) => task.taskId == _task.taskId);
      });
      this.setMeta(res);
      return tasks;
    }))
  }

  handover(newAssigneeId: number) {
    return this.http.put(`${environment.apiUrl}api/Tasks/Handover`, {
      newAssigneeId,
      handOverTasksIds: this.selectedTasksToHandoverValue.map((task: any) => {
        return task.taskId
      })
    });
  }

  changeCreator(userId: number) {
    return this.http.post(`${environment.apiUrl}api/TaskGroups/ChangeTaskCreator`, {
      userId,
      taskGroupId: this.selectedTasksToHandoverValue.map((task: any) => {
        return task.taskGroupId
      })
    });
  }

  private url = `${environment.apiUrl}api/Tasks/GetAllTasksExcel`;

  getTasksExcel(params:HttpParams): Observable<any> {

    const headers = new HttpHeaders({
      'accept': '/',
    });

    return this.http.get(this.url, { headers: headers, responseType: 'blob' ,params : params})

  }
  getTaskProps(taskId:any) {
    return this.http.post(`${environment.apiUrl}api/TaskGroups/GetTaskProps?taskId=${taskId}` , {})
  }

}
