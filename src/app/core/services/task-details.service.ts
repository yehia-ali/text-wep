import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, forkJoin, map, mergeMap, of, switchMap} from "rxjs";
import {environment} from "../../../environments/environment";
import {TaskDetails} from "../interfaces/task-details";
import {convertToUTC} from "../functions/convertToUTC";
import {Urlify} from "../functions/urlify";
import {WorkingHoursService} from "./working-hours.service";
import {ChatService} from "../../secure/user/chat/chat.service";

@Injectable({
  providedIn: 'root'
})
export class TaskDetailsService extends WorkingHoursService {
  chatSer = inject(ChatService);
  hasChanged = new BehaviorSubject(false);
  loading = new BehaviorSubject(true);
  id = new BehaviorSubject(0);
  chatLoading = new BehaviorSubject(true)
  gotChat = new BehaviorSubject(false);
  details = new BehaviorSubject<any>({})
  constructor(private http: HttpClient) {
    super();
  }

  getTaskDetails() {
    this.loading.next(true);
    this.chatLoading.next(true);
    return this.http.get(`${environment.apiUrl}api/Tasks/GetTaskDetails?id=${this.id.value}`).pipe(
      switchMap((res: any) => {
        const task: TaskDetails = res.data;
        const currentUser = parseInt(localStorage.getItem('id') || '');

        // Check if the task has started
        task.hasStarted = convertToUTC(task.startDate).getTime() < new Date().getTime();

        // to check if the current user is the creator
        task.creator = task.taskGroupCreatorId == currentUser

        // to check if the current user is the assignee
        task.isAssignee = task.assigneeId == currentUser

        // to check if the current user is the manager
        task.isManager = task.managerId == currentUser

        // Check if the current user can update the rate
        task.canUpdateRate = new Date(convertToUTC(task.rateDate).setMinutes(convertToUTC(task.rateDate).getMinutes() + 10)).getTime() >= new Date().getTime();

        // check if user is in location if task is meeting or location
        if (task.taskGroupType == 5) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: any) => {
              if (position) {
                let current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                let taskLocation = new google.maps.LatLng(task.latitude, task.longitude);
                const distance = google.maps.geometry.spherical.computeDistanceBetween(current, taskLocation);
                task.inLocation = distance <= 100;
              }
            })
          }
        } else {
          task.inLocation = true;
        }

        // Check if the task has stopped repeating
        if (convertToUTC(task.endTimeForRepeat).getTime() < new Date().getTime()) {
          task.stopedRepeat = true
        }

        // Set the max value of the progress bar depending on the user role
        task.max = task.isAssignee ? 100 : task.creator ? 99 : 100;

        // Filter out attachments with fileType 5 and update soundDescription
        task.taskGroupAttachments = task.taskGroupAttachments.filter((attachment: any) => {
          if (attachment.fileType === 5) {
            task.soundDescription = `${environment.apiUrl}/${attachment.filePath}`;
          }
          return attachment.fileType !== 5;
        });

        // Urlify description and definitionOfDone
        if (task.description) task.description = Urlify(task.description);
        if (task.definitionOfDone) task.definitionOfDone = Urlify(task.definitionOfDone);
        task.workingHours = {}
        this.workingHours(task.workingHours, task.expectedTime, task.actualTime);
        // Combine inner observables using mergeMap
        return forkJoin([
          this.getReporters(task.taskGroupId),
          this.getSubTasks(task.taskGroupId),
          this.getTaskHistory(task.taskId),
          this.getTaskLog(task.taskId),
        ]).pipe(
          mergeMap(([reporters, subTasks, taskHistory, taskLog]) => {
            task.reporters = reporters;
            let taskHistoryRes: any = taskHistory;
            let taskLogTime: any = taskLog
            // to extract the reporter data from the reporters array to show it in the details page
            task.reportersImagesUrls = reporters.map((reporter: any, index: number) => {
              task.reporters[index].image = reporter.reporterProfilePicture;
              task.reporters[index].name = reporter.reporterName;
              task.reporters[index].jobTitle = reporter.reporterJobTitle;
              return reporter.reporterProfilePicture;
            });

            task.subTasks = subTasks;

            if (taskHistoryRes.success) {
              const histories = taskHistoryRes.data;
              // Group histories by date
              const groups = histories.reduce((groups: any, history: any) => {
                const date = new Date(new Date(history.creationDate).setHours(0, 0, 0, 0)).getTime();
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(history);
                return groups;
              }, {});

              // Format histories into an array
              task.histories = Object.keys(groups).map((date) => ({
                date: new Date(+date),
                messages: groups[date],
              }));
            }

            if (taskLogTime.success) {
              const timeLog = taskLogTime.data;
              // Group histories by date
              const groups = timeLog.reduce((groups: any, log: any) => {
                const date = new Date(new Date(log.creationDate).setHours(0, 0, 0, 0)).getTime();
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(log);
                return groups;
              }, {});

              // Format histories into an array
              task.timeLogHistory = Object.keys(groups).map((date) => ({
                date: new Date(+date),
                messages: groups[date],
              }));
            }
            this.loading.next(false);
            if ((task.creator || task.isAssignee) && (task.taskStateId == 1 || task.taskStateId == 2 || task.taskStateId == 3) && !this.gotChat.value) {
              this.getOrCreateChat(task.taskGroupId).subscribe(__res => {
                console.log(__res);

                if (__res) {
                  setTimeout(() => {
                    this.chatLoading.next(false);
                    this.gotChat.next(true)
                  }, 1000)
                  let chatData: any = __res;
                  this.chatSer.roomId.next(chatData.data.taskGroupChatId);
                  this.chatSer.getRoomChat(true);
                }
              })
            } else {
              this.chatLoading.next(false)
            }
            this.details.next(task)
            return of(task);
          })
        );
      })
    );
  }


  getReporters(id: any) {
    return this.http.get(`${environment.apiUrl}api/TaskGroupReporters/GetReporters?id=${id}`).pipe(map((data: any) => {
      return data.data.items;
    }))
  }

  getTaskHistory(id: number) {
    return this.http.get(`${environment.apiUrl}api/TaskHistory/Get?taskId=${id}`)
  }

  getTaskLog(id: number) {
    return this.http.get(`${environment.apiUrl}api/TimeSheet/GetTaskLogs?TaskId=${id}`).pipe(map((res: any) => {
      return res.data;
    }));
  }


  getSubTasks(id: number) {
    return this.http.get(`${environment.apiUrl}api/TaskGroups/GetMyChildTaskGroups?parentTaskGroupId=${id}`).pipe(map((res: any) => {
      return res.data.items;
    }));
  }

  updateTodoList(data: any) {
    return this.http.put(`${environment.apiUrl}api/TaskTodosList/Update`, data);
  }

  stopRepeat(data: any) {
    return this.http.put(`${environment.apiUrl}api/TaskGroups/StopRepeat`, data);
  }

  updateEstimate(data: any) {
    return this.http.put(`${environment.apiUrl}api/Tasks/UpdateEstimatedTime`, data);
  }

  noted(id: number) {
    return this.http.put(`${environment.apiUrl}api/Tasks/SetSignatureTaskNoticed`, {id});
  }

  updateTaskProgress(data: any) {
    return this.http.put(`${environment.apiUrl}api/Tasks/UpdateProgress`, data);
  }

  addRate(data: any) {
    return this.http.put(`${environment.apiUrl}api/Tasks/UpdateRate`, data);
  }


  getTaskGroupUserRole(id: number) {
    return this.http.get(
      `${environment.apiUrl}api/TaskGroups/GetTaskGroupUserRole?id=${id}`).pipe(map((res: any) => {
      let userRole = res.data.taskUserRole;
      let taskId = res.data.taskId;
      let taskGroupId = res.data.taskGroupId;
      return {userRole, taskId, taskGroupId};
    }));
  }

  getOrCreateChat(id: number) {
    return this.http.post(`${environment.apiUrl}api/Chat/AddTaskChatRoom`, {id})
  }

  logTime(data: any) {
    return this.http.post(`${environment.apiUrl}api/TimeSheet/LogTime`, data)
  }


  cancelTask(taskIds: number) {
    return this.http.put(`${environment.apiUrl}api/Tasks/Cancel`, {taskIds: [taskIds]});
  }

  deleteTask(data: any) {
    return this.http.put(`${environment.apiUrl}api/Tasks/delete`, data);
  }
  getDetails(id:any){
    return this.http.get(`${environment.apiUrl}api/Tasks/GetTaskDetails?id=${id}`)
  }
  getProps(id:any){
    return this.http.post(`${environment.apiUrl}api/TaskGroups/GetTaskProps?taskId=${id}` , '')
  }
  answerProps(params:HttpParams){
    return this.http.post(`${environment.apiUrl}api/TaskGroups/AnswerProp` , '' , {params})
  }
  uploadPropFile(file:any){
    return this.http.post(`${environment.apiUrl}api/attachment/UploadFile` , file)
  }
}

