import {Injectable} from '@angular/core';
import {FiltersService} from "./filters.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {debounceTime, map, Observable, switchMap} from "rxjs";
import {TaskSent} from "../interfaces/task-sent";
import {convertToUTC} from "../functions/convertToUTC";
import {CC} from "../interfaces/cc";
import {ExpectedTime} from "../functions/expected-time";

@Injectable({
  providedIn: 'root'
})
export class TaskCcService extends FiltersService {
  cc$: Observable<CC[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getSentTasksAsAReporter().pipe(map((res: any) => res))));

  constructor(private http: HttpClient) {
    super();
  }

  // For current user TaskSent with cc
  getSentTasksAsAReporter() {
    this.loading.next(true);
    const url = new URL(`${environment.apiUrl}api/TaskGroupReporters/GetMyTaskGroups?isCollapsed=true`);
    this.params(url);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.loading.next(false);
      let taskGroups = res.data.items;
      let now = new Date().getTime();
      taskGroups.forEach((task: TaskSent) => {
        let endDate = convertToUTC(task.endDate).getTime();
        task.isOverDue = endDate - now < 0;
        ExpectedTime(task, task.expectedTime)
      });
      this.setMeta(res);
      return res.data.items;
    }));
  }
}
