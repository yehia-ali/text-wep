import {Injectable} from '@angular/core';
import {BehaviorSubject, debounceTime, map, Observable, switchMap} from "rxjs";
import {FiltersService} from "./filters.service";
import {TaskInbox} from "../interfaces/task-inbox";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import TimeLeft from "../functions/time-left";

@Injectable({
  providedIn: 'root'
})
export class MeetingService extends FiltersService {
  inbox$: Observable<TaskInbox[]> = this.hasChanged.pipe(debounceTime(400), switchMap(() => this.getInbox().pipe(map((res: any) => res))));
  meetingName$ = new BehaviorSubject<any>('')
  currentUser = localStorage.getItem('id');

  constructor(private http: HttpClient) {
    super();
  }

  getInbox() {
    this.loading.next(true);
    let url = new URL(`${environment.apiUrl}api/Tasks/GetUserTasks`);
    url.searchParams.append('TaskGroupType', '4');
    url.searchParams.append('userId', String(this.currentUser))
    this.params(url)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.setMeta(res);
      let inbox = res.data.items;
      inbox.forEach((task: TaskInbox) => {
        TimeLeft(task);
      });
      this.loading.next(false);
      return inbox;
    }))
  }

}
