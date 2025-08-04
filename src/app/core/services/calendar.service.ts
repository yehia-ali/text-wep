import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  myCalendar = new BehaviorSubject([])
  startDate = new BehaviorSubject<any>(this.getFirstDayOfMonth(new Date().getFullYear(), new Date().getMonth()));
  lastDayOfMonth = new BehaviorSubject(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  id = new BehaviorSubject<any>(localStorage.getItem('id'));
  tasksToggle = new BehaviorSubject(true);
  meetingsToggle = new BehaviorSubject(false)
  votesToggle = new BehaviorSubject(false)
  holidaysToggle = new BehaviorSubject(false)
  leavesToggle = new BehaviorSubject(false)
  taskAssignee = new BehaviorSubject<any>([]);
  taskCreator = new BehaviorSubject<any>([]);
  taskType = new BehaviorSubject<any>(null);
  taskStatus = new BehaviorSubject<any>(null);
  taskPriority = new BehaviorSubject<any>(null);
  taskRate = new BehaviorSubject<any>(null);
  taskOverdue = new BehaviorSubject<any>(null);
  taskProject = new BehaviorSubject<any>(null);
  voteStates = new BehaviorSubject<any>([]);
  voteCreators = new BehaviorSubject<any>([]);
  voteAssignees = new BehaviorSubject<any>([]);
  leaveUser = new BehaviorSubject<any>([]);
  leaveManager = new BehaviorSubject<any>([]);
  leaveStatus = new BehaviorSubject<any>(null);
  selectedUser = new BehaviorSubject<any>(null);

  authUserId:any = localStorage.getItem('id');
  constructor(private http: HttpClient) {}


  getMyCalendar() {
    let url = new URL(`${environment.apiUrl}api/UserProfile/GetUserCalendar`);
    url.searchParams.append('from', formatDate(this.startDate.value, 'yyyy-MM-ddT05:mm:ss', 'en'));
    url.searchParams.append('to', formatDate(this.lastDayOfMonth.value, 'yyyy-MM-ddT19:mm:ss', 'en'));
    this.tasksToggle.value && url.searchParams.append('type', '1');
    this.votesToggle.value && url.searchParams.append('type', '2');
    this.leavesToggle.value && url.searchParams.append('type', '3');
    this.holidaysToggle.value && url.searchParams.append('type', '4');
    this.meetingsToggle.value && url.searchParams.append('type', '5');
    // url.searchParams.append('userIds', this.authUserId)

    // selectedUsers.forEach(userId => {
    //   url.searchParams.append('userIds', userId);
    // });

    this.selectedUser.value?.length > 0 && this.selectedUser.value.map((user: any) => {
      url.searchParams.append('assigneeIds', user.id)
    });

    this.taskAssignee.value?.length > 0 && this.taskAssignee.value.map((user: any) => {
      url.searchParams.append('assigneeIds', user.id)
    });

    this.taskCreator.value?.length > 0 && this.taskCreator.value.map((user: any) => {
      url.searchParams.append('CreatorIds', user.id)
    });

    this.taskType.value?.length > 0 && this.taskType.value.map((type: any) => {
      url.searchParams.append('TaskTypeIds', type)
    });
    this.taskStatus.value?.length > 0 && this.taskStatus.value.map((status: any) => {
      url.searchParams.append('TaskStateIds', status)
    });
    this.taskPriority.value?.length > 0 && this.taskPriority.value.map((priority: any) => {
      url.searchParams.append('TaskPriorityIds', priority)
    });
    this.taskRate.value && url.searchParams.append('rate', this.taskRate.value);
    this.taskOverdue.value && url.searchParams.append('IsOverDue', this.taskOverdue.value);
    this.taskProject.value?.length > 0 && this.taskProject.value.map((status: any) => {
      url.searchParams.append('project', status)
    });

    this.voteStates.value?.length > 0 && this.voteStates.value.map((state: any) => {
      url.searchParams.append('VoteStateIds', state)
    });

    this.voteAssignees.value?.length > 0 && this.voteAssignees.value.map((user: any) => {
      url.searchParams.append('VoteassigneeIds', user.id)
    });

    this.voteCreators.value?.length > 0 && this.voteCreators.value.map((user: any) => {
      url.searchParams.append('VoteCreatorIds', user.id)
    });

    this.leaveUser.value?.length > 0 && this.leaveUser.value.map((user: any) => {
      url.searchParams.append('LeaveUserIds', user.id)
    });

    this.leaveManager.value?.length > 0 && this.leaveManager.value.map((user: any) => {
      url.searchParams.append('LeaveManagerId', user.id)
    });

    this.leaveStatus.value && url.searchParams.append('LeaveStatusIds', this.leaveStatus.value);


    return this.http.get(`${url}`).pipe(map((res: any) => {
      let tasks = res.data[0].calendar;
      tasks.map((task: any) => {
        task.start = task.startDate;
        task.end = task.endDate;
        task.myCalendarTaskId = task.id
      });
      this.myCalendar.next(tasks)
      return tasks;
    }))
  }
  getManagerCalendar() {
    let url = new URL(`${environment.apiUrl}api/UserProfile/GetManagerCalendar`);
    url.searchParams.append('from', formatDate(this.startDate.value, 'yyyy-MM-ddT05:mm:ss', 'en'));
    url.searchParams.append('to', formatDate(this.lastDayOfMonth.value, 'yyyy-MM-ddT23:59:59', 'en'));
    this.tasksToggle.value && url.searchParams.append('type', '1');
    this.votesToggle.value && url.searchParams.append('type', '2');
    this.leavesToggle.value && url.searchParams.append('type', '3');
    this.holidaysToggle.value && url.searchParams.append('type', '4');
    this.meetingsToggle.value && url.searchParams.append('type', '5');
    // url.searchParams.append('userIds', this.authUserId)

    // selectedUsers.forEach(userId => {
    //   url.searchParams.append('userIds', userId);
    // });

    this.selectedUser.value?.length > 0 && this.selectedUser.value.map((user: any) => {
      url.searchParams.append('assigneeIds', user.id)
    });

    this.taskAssignee.value?.length > 0 && this.taskAssignee.value.map((user: any) => {
      url.searchParams.append('assigneeIds', user.id)
    });

    this.taskCreator.value?.length > 0 && this.taskCreator.value.map((user: any) => {
      url.searchParams.append('CreatorIds', user.id)
    });

    this.taskType.value?.length > 0 && this.taskType.value.map((type: any) => {
      url.searchParams.append('TaskTypeIds', type)
    });
    this.taskStatus.value?.length > 0 && this.taskStatus.value.map((status: any) => {
      url.searchParams.append('TaskStateIds', status)
    });
    this.taskPriority.value?.length > 0 && this.taskPriority.value.map((priority: any) => {
      url.searchParams.append('TaskPriorityIds', priority)
    });
    this.taskRate.value && url.searchParams.append('rate', this.taskRate.value);
    this.taskOverdue.value && url.searchParams.append('IsOverDue', this.taskOverdue.value);
    this.taskProject.value?.length > 0 && this.taskProject.value.map((status: any) => {
      url.searchParams.append('project', status)
    });

    this.voteStates.value?.length > 0 && this.voteStates.value.map((state: any) => {
      url.searchParams.append('VoteStateIds', state)
    });

    this.voteAssignees.value?.length > 0 && this.voteAssignees.value.map((user: any) => {
      url.searchParams.append('VoteassigneeIds', user.id)
    });

    this.voteCreators.value?.length > 0 && this.voteCreators.value.map((user: any) => {
      url.searchParams.append('VoteCreatorIds', user.id)
    });

    this.leaveUser.value?.length > 0 && this.leaveUser.value.map((user: any) => {
      url.searchParams.append('LeaveUserIds', user.id)
    });

    this.leaveManager.value?.length > 0 && this.leaveManager.value.map((user: any) => {
      url.searchParams.append('LeaveManagerId', user.id)
    });

    this.leaveStatus.value && url.searchParams.append('LeaveStatusIds', this.leaveStatus.value);


    return this.http.get(`${url}`).pipe(map((res: any) => {
      let tasks = res.data;
      tasks.map((task: any) => {
        task.start = task.endDate;
        task.end = task.endDate;
        task.myCalendarTaskId = task.id
      });
      this.myCalendar.next(tasks)
      return tasks;
    }))
  }

  getFirstDayOfMonth(year: any, month: any) {
    return new Date(year, month, 1);
  }

  getTeamMembers() {
    return this.http.get(`${environment.apiUrl}api/Space/GetSpaceUserProfiles?managers=${localStorage.getItem('id')}&isActive=true`).pipe(map(((res: any) => res.data.items)))
  }


  addToCalendar(data: any) {
    return this.http.post(`${environment.apiUrl}api/TaskCalendar/Create`, data)
  }

  deleteTask(id: any) {
    return this.http.delete(`${environment.apiUrl}api/TaskCalendar/Delete?id=${id}`)
  }
}
