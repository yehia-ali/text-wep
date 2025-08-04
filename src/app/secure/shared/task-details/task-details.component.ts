import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TopSectionComponent } from "./top-section/top-section.component";
import { TaskDetailsService } from "../../../core/services/task-details.service";
import { ActivatedRoute } from "@angular/router";
import { LoadingComponent } from "../../../core/components/loading.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { TaskDescriptionComponent } from "../../../core/components/task-description.component";
import { TaskAttachmentsComponent } from "../../../core/components/task-attachments.component";
import { TaskTodoComponent } from "../../../core/components/task-todo.component";
import { ArabicDatePipe } from "../../../core/pipes/arabic-date.pipe";
import { TaskRepeatComponent } from "../../../core/components/task-repeat.component";
import { GoogleMapsModule } from "@angular/google-maps";
import { ChatModule } from "../../user/chat/chat.module";
import { ChatService } from "../../user/chat/chat.service";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { LogTimeComponent } from "../../../core/components/log-time/log-time.component";
import { Priority } from 'src/app/core/enums/priority';
import { TaskStatus } from 'src/app/core/enums/task-status';
import { TaskType } from 'src/app/core/enums/task-type';
import { UserWithImageComponent } from "../../../core/components/user-with-image/user-with-image.component";
import { ConvertMinutesPipe } from "../../../core/pipes/convert-minutes.pipe";
import { ArabicTimePipe } from "../../../core/pipes/arabic-time.pipe";
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SetActualTimeComponent } from 'src/app/core/components/set-actual-time.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { SafeHtmlDirective } from 'src/app/core/directives/safe-html.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { environment } from 'src/environments/environment';
import { TaskUpdateProgressComponent } from "../../../core/components/task-update-progress/task-update-progress.component";
import { ChartRadialBarComponent } from "../../../core/components/charts/app-chart/chart-radial-bar.component";
import { KpiStatus } from 'src/app/core/enums/kpis-status';

@Component({
  selector: 'task-details',
  standalone: true,
  imports: [
    CommonModule,
    SafeHtmlDirective,
    SplitButtonModule,
    TopSectionComponent,
    LoadingComponent,
    TranslateModule,
    TaskDescriptionComponent,
    TaskAttachmentsComponent,
    TaskTodoComponent,
    ArabicDatePipe,
    TaskRepeatComponent,
    GoogleMapsModule,
    ChatModule,
    MatButtonModule,
    UserWithImageComponent,
    ConvertMinutesPipe,
    ArabicTimePipe,
    MatCheckboxModule,
    FormsModule,
    CalendarModule,
    TaskUpdateProgressComponent,
    ChartRadialBarComponent
],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
kpiStatus = KpiStatus;
rateAdded($event: any) {
  if($event){
    this.getTaskDetails()
  }
}

  items: any[] = [];
  taskStarted: boolean;
  taskType: any = enumToArray(TaskType);
  TaskStatus: any = enumToArray(TaskStatus);
  Priority: any = enumToArray(Priority);
  service = inject(TaskDetailsService);
  dialog = inject(MatDialog);
  chatSer = inject(ChatService);
  details: any;
  url = environment.apiUrl;
  spaceId = localStorage.getItem('space-id');
  route = inject(ActivatedRoute);
  loading = this.service.loading;
  center: google.maps.LatLngLiteral | any;
  options: google.maps.MapOptions = {
    // mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    maxZoom: 25,
    minZoom: 8,
  };
  id: any;
  chatData: any;
  history: any;
  logs: any;
  loggedTime: any;
  totalHours: number;
  totalMinutes: number;
  isAssinee: boolean;
  chatBtn: boolean;
  questions: any[] = [];
  isAnswered = false;
  typeDate: any;
  selectedFile: any;
  uploadFileBtn = false;
  achieved: number;
  constructor(
    private translate: TranslateService,
    private datePipe: DatePipe,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.id =
      this.route.snapshot.queryParams['id'] || this.route.snapshot.params['id'];
    if (this.route.snapshot.queryParams['id']) {
      this.chatBtn = false;
    } else {
      this.chatBtn = true;
    }
    this.route.queryParamMap.subscribe(params => {
      const  startDate = params.get('startDate');
      const endDate = params.get('endDate');
     
    });
    // this.service.id.next(this.id);
    // this.service.hasChanged.next(true);
    this.getTaskDetails();
    this.setTranslatedItems();
    this.getLoggedTime();
  }

  setTranslatedItems() {
    this.translate
      .get(['todo', 'completed', 'in_progress'])
      .subscribe((translations) => {
        this.items = [
          // { label: translations['todo'], command: () => this.changeStatus(1) },
          {
            label: translations['in_progress'],
            command: () => this.changeStatus(3),
          },
          {
            label: translations['completed'],
            command: () => this.changeStatus(2),
          },
        ];
      });
  }

  // Example of the click handler
  changeStatus(value: number) {
    if (value == 3 && this.details.taskStateId == 1) {
      let data = {
        id: this.details.taskId,
        percentage: 0,
        actualTime: null,
      };
      this.service
        .updateEstimate({
          estimatedTime: this.details.expectedTime,
          id: this.details.taskId,
        })
        .subscribe(() => {
          this.service.updateTaskProgress(data).subscribe((res: any) => {
            if (res.success) {
              this.alert.showAlert('success');
              this.getTaskDetails();
            }
          });
        });
    } else if (value == 3 && this.details.taskStateId == 2) {
      let data = {
        id: this.details.taskId,
        percentage: 0,
        actualTime: null,
      };

      this.service.updateTaskProgress(data).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('success');
          this.getTaskDetails();
        }
      });
    } else if (value == 2 && this.details.taskStateId == 3) {
      let logged: any;
      if (!this.isAnswered) {
        this.alert.showAlert('answer_questions_first', 'bg-danger')
      } else {
        if (this.loggedTime != '00:00') {
          logged = this.totalHours * 60 + this.totalMinutes;
        } else {
          logged = null;
        }

        if (!logged) {
          let dialogRef = this.dialog.open(SetActualTimeComponent, {
            panelClass: 'small-dialog',
            data: { task: this.details },
          });
          dialogRef.afterClosed().subscribe((res: any) => {
            if (res.success) {
              this.alert.showAlert('success');
              this.getTaskDetails();
            }
          });
        } else {
          let data = {
            id: this.id,
            percentage: 0,
            actualTime: logged,
          };
          this.service.updateTaskProgress(data).subscribe((res: any) => {
            if (res.success) {
              data.percentage = 100;
              this.service.updateTaskProgress(data).subscribe((res: any) => {
                if (res.success) {
                  this.alert.showAlert('success');
                  this.getTaskDetails();
                }
              });
            }
          });
        }
      }

    } else if (value == 2 && this.details.taskStateId == 1 && this.details.taskGroupType != 8) {
      if (!this.isAnswered) {
        this.alert.showAlert('answer_questions_first', 'bg-danger')
      } else {
        let logged: any;
        if (this.loggedTime != '00:00') {
          logged = this.totalHours * 60 + this.totalMinutes;
        } else {
          logged = null;
        }
        let data = {
          id: this.id,
          percentage: 0,
          actualTime: logged,
        };
        this.service
          .updateEstimate({
            estimatedTime: this.details.expectedTime,
            id: this.details.taskId,
          })
          .subscribe((res: any) => {
            if (!logged) {
              this.service.updateTaskProgress(data).subscribe((res: any) => {
                let dialogRef = this.dialog.open(SetActualTimeComponent, {
                  panelClass: 'small-dialog',
                  data: { task: this.details },
                });
                dialogRef.afterClosed().subscribe((res: any) => {
                  if (res.success) {
                    this.alert.showAlert('success');
                    this.getTaskDetails();
                  }
                });
              });
            } else {
              this.service.updateTaskProgress(data).subscribe((res: any) => {
                if (res.success) {
                  data.percentage = 100;
                  this.service.updateTaskProgress(data).subscribe((res: any) => {
                    if (res.success) {
                      this.alert.showAlert('success');
                      this.getTaskDetails();
                    }
                  });
                }
              });
            }
          });
      }
    } else if (value == 2 && this.details.taskStateId == 1 && this.details.taskGroupType == 8) {

      let data = {
        id: this.id,
        percentage: 0,
        actualTime: 15,
      };
      this.service.updateEstimate({
        estimatedTime: 15,
        id: this.details.taskId,
      })
        .subscribe((res: any) => {
          this.service.updateTaskProgress(data).subscribe((res: any) => {
            if (res.success) {
              data.percentage = 100;
              this.service.updateTaskProgress(data).subscribe((res: any) => {
                if (res.success) {
                  this.alert.showAlert('success');
                  this.getTaskDetails();
                }
              });
            }
          });
        });
    }
  }

  getTaskDetails() {
    this.details = null;
    this.service.loading.next(true);
    setTimeout(() => {
      this.service.getDetails(this.id).subscribe((res: any) => {
        this.service.loading.next(false);
        if (res.success) {
          this.details = res.data;

          this.service.getProps(res.data.taskId).subscribe((res: any) => {
            this.isAnswered = res.data.every((item: any) => item.isAnswered == true);
            this.questions = res.data
          })
          if (this.details.assigneeId == localStorage.getItem('id')) {
            this.isAssinee = true;
          } else {
            this.isAssinee = false;
          }
          this.details.isAssignee = this.isAssinee
          let start: any | Date = this.datePipe.transform(
            res.data.startDate,
            'yyyy-MM-ddTHH:mm:ss'
          );
          let current: any | Date = this.datePipe.transform(
            new Date(),
            'yyyy-MM-ddTHH:mm:ss',
            'UTC'
          );
          if (current >= start) {
            this.taskStarted = true;
          } else {
            this.taskStarted = false;
          }
          this.service
            .getOrCreateChat(res.data.taskGroupId)
            .subscribe((chat: any) => {
              if (chat && chat.data && chat.data.taskGroupChatId) {
                // Proceed if chat and taskGroupChatId exist
                this.chatData = chat.data;
                this.chatSer.roomId.next(this.chatData.taskGroupChatId);
                this.chatSer.getRoomChat(true);
                this.service.gotChat.next(true);
                setTimeout(() => {
                  this.service.chatLoading.next(false);
                }, 100);
              }
          });
          this.achieved = (((Number(this.details?.kpi.value) || 0) / (Number(this.details?.kpi.target) || 0)) * 100) || 0
        }
      });
    }, 1000);
  }

  logTime() {
    let dialogRef = this.dialog.open(LogTimeComponent, {
      panelClass: 'manage-users-dialog',
      data: this.id,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getLoggedTime();
    });
  }

  getLoggedTime() {
    this.service.getTaskLog(this.id).subscribe((res: any) => {
      this.calculateTotalTime(res);
    });
  }

  calculateTotalTime(tasks: any): string {
    this.totalHours = 0;
    this.totalMinutes = 0;

    tasks.forEach((task: any) => {
      this.totalHours += task.hours;
      this.totalMinutes += task.minutes;
    });

    this.totalHours += Math.floor(this.totalMinutes / 60);
    this.totalMinutes = this.totalMinutes % 60;

    const formattedHours = this.totalHours.toString().padStart(2, '0');
    const formattedMinutes = this.totalMinutes.toString().padStart(2, '0');

    this.loggedTime = `${formattedHours}:${formattedMinutes}`;
    return `${formattedHours}:${formattedMinutes}`;
  }

  ngOnDestroy() {
    this.chatSer.roomId.next('0');
    this.chatSer.roomUsersIds.next([]);
    this.chatSer.messages$.next([]);
    this.service.gotChat.next(false);
  }
  selectedFiles: any | { [key: string]: File } = {};
  uploadFileBtns: { [key: string]: boolean } = {};

  saveAnswers() {
    let count = 0;
    this.questions.forEach((answer: any) => {
      count++;
      if (answer && !answer.isAnswered && answer.dataType != 5) {
        if (answer.dataType == 2 && answer.value == null) {
          answer.value = false;
        }
        if (answer.dataType == 4) {
          let value = this.datePipe.transform(answer.value, 'yyyy-MM-ddTHH:mm:ss', 'UTC');
          answer.value = value;
        }
        let data = new HttpParams().set('taskId', this.id).set('propId', answer.id).set('value', answer.value);
        this.service.answerProps(data).subscribe((res: any) => { });
      } else if (answer && !answer.isAnswered && answer.dataType == 5 && this.selectedFiles[answer.id]) {
        const formData = new FormData();
        formData.append('file', this.selectedFiles[answer.id]);
        this.service.uploadPropFile(formData).subscribe((res: any) => {
          if (res.success) {
            answer.value = res.data;
            let data = new HttpParams()
              .set('taskId', this.id)
              .set('propId', answer.id)
              .set('value', answer.value);
            this.service.answerProps(data).subscribe();
          }
        });
      }
    });
    if (count == this.questions.length) {
      this.alert.showAlert('success');
      this.getTaskDetails();
    }
  }

  uploadFile(item: any) {
    const fileInput = document.getElementById('fileInput' + item.id) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelect(event: any, item: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedExtensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt',
        '.pptx', '.txt', '.csv', '.zip', '.rar', '.7z', '.xml', '.json', '.mp3', '.wav', '.mp4', '.avi',
        '.mov', '.mkv'
      ];
      const fileExtension = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        this.alert.showAlert('file_not_allow', 'bg-danger');
        return;
      } else if (file.size > 5000000) {
        this.alert.showAlert('file_grater_than', 'bg-danger');
        return;
      }
      this.uploadFileBtns[item.id] = true; // تفعيل زر الرفع للسؤال
      this.selectedFiles[item.id] = file; // حفظ الملف للسؤال
    }
  }

  clearFile(item: any) {
    delete this.selectedFiles[item.id];
    this.uploadFileBtns[item.id] = false;
  }

  getTaskStatusByValue(value: number): any {
    const status = this.TaskStatus.find((item: any) => item.value == value);
    return status;
  }

}

