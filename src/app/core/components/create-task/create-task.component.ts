import { take } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles.service';
import { Title } from '@angular/platform-browser';
import {
  Component,
  ElementRef,
  inject,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateTaskService } from '../../services/create-task.service';
import { InputLabelComponent } from '../../inputs/input-label.component';
import { InputErrorComponent } from '../../inputs/input-error.component';
import { FieldLengthComponent } from '../field-length.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { enumToArray } from '../../functions/enum-to-array';
import { TaskType } from '../../enums/task-type';
import { Priority } from '../../enums/priority';
import { PriorityComponent } from '../priority.component';
import { MatButtonModule } from '@angular/material/button';
import { SubmitButtonComponent } from '../submit-button.component';
import { CreateTaskTimingComponent } from '../create-task-timing/create-task-timing.component';
import { SelectTimeComponent } from '../select-time.component';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { GetAttachmentsComponent } from '../get-attachments.component';
import { CreateTaskTodoComponent } from '../create-task-todo.component';
import { SelectUserComponent } from '../select-user.component';
import { LocationComponent } from '../location/location.component';
import { AlertService } from '../../services/alert.service';
import { Project } from '../../interfaces/project';
import { ProjectService } from '../../servicess/project.service';
import { DraftService } from '../../services/draft.service';
import { SelectUsersService } from '../../services/select-users.service';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../services/user.service';
import { MeetingService } from '../../services/meeting.service';
import { TextEditorComponent } from '../text-editor.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MapsComponent } from "../maps/maps.component";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TemplatesService } from '../../services/templates.service';
import { SelectTemplateComponent } from '../select-template/select-template.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GetUsersKpisDialogComponent } from '../get-users-kpis-dialog/get-users-kpis-dialog.component';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'create-task',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatCheckboxModule,
    TextEditorComponent,
    CommonModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    InputLabelComponent,
    InputErrorComponent,
    FieldLengthComponent,
    NgSelectModule,
    PriorityComponent,
    MatButtonModule,
    SubmitButtonComponent,
    CreateTaskTimingComponent,
    SelectTimeComponent,
    AngularEditorModule,
    GetAttachmentsComponent,
    CreateTaskTodoComponent,
    SelectUserComponent,
    MapsComponent,
    MatSlideToggleModule,
    SplitButtonModule,
    MatTooltipModule,
    FormsModule
],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  onAddStagePress($event: any) {
    if ($event.key === 'Enter') {
      this.saveStage()
    }
  }

  saveStage(){
    const data = {
      templateId: this.selectedTemplate.id,
      name: this.stageTitle || 'stage ' + this.stages.length + 1,
      order: this.stages.length + 1
    }
    this.templateServ.addStage(data).subscribe((res:any) => {
      this.stages = [...this.stages, res.data];
      this.stageTitle = ''
      this.alert.showAlert('success')

      this.addStage = false;
    })
  }
selectedTemplate:any
stages: any[] = [];
stageMode = false;
addStage = false;
stageTitle: any = '';
openKpiDialog() {
  let dialogRef = this.dialog.open(GetUsersKpisDialogComponent , {
    width:'860px',
    height:'605px',
    data:{
      assignees:this.assignees,
      selectedData:this.selectedKpis
    }
  })

  dialogRef.afterClosed().subscribe((res:any) => {
    if(res){
      this.selectedKpis = res.map((item:any) => {
        return {
          assigneeId: item.userId,
          kpiEmplooyeeId: item.employeeKpiId
        }
      })
    }
  })

}

  emloyeesItems:any
  branchesItems:any
  @ViewChild(LocationComponent) locationComponent!: LocationComponent;
  userSer = inject(UserService);
  meetingSer = inject(MeetingService);
  form!: FormGroup | any;
  timingForm!:any| FormGroup;
  locationForm!: FormGroup;
  loading = false;
  taskType = enumToArray(TaskType);
  priorities = enumToArray(Priority);
  hours = 0;
  minutes = 30;
  attachments: any[] = [];
  todos: any = [];
  assignees: any = [];
  reporters: any = [];
  assigneesDepartment: any = [];
  reportersDepartment: any = [];
  isMeeting = false;
  isSignature = false;
  isLocation = false;
  isTicketing = false;
  soundDescription: any;
  projects: Project[] = [];
  selectedUsers : any[]= [];
  selectedReporters = [];
  baseUrl = environment.apiUrl;
  more = false;
  needApprove: boolean;
  assigneesManager: any[] = [];
  assigneesPlaces: any[] = [];
  assigneesLevels: any[] = [];
  assigneesJobTitles: any[] = [];
  taskGroubId: any;
  isEdit = false
  taskEditDetails:any
  startDate:any
  endDate:any
  props: any[] = [];
  selectedTaskType: any;
  isMeetingLocation = false;
  long: any;
  lat: any;
  employeeMode: boolean;
  selectedFile: any;
  uploadFile = false;
  url = environment.apiUrl;
  empFileContent:any[] = []
  branchFileContent:any[] = []
  customSpaceId = localStorage.getItem('space-id')
  isKpi= false;
  selectedKpis: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CreateTaskService,
    private fb: FormBuilder,
    private elm: ElementRef,
    private alert: AlertService,
    private dialog: MatDialog,
    private projectsSer: ProjectService,
    private draftSer: DraftService,
    private selectUserSer: SelectUsersService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    private role: RolesService,
    private translate: TranslateService,
    private templateServ: TemplatesService,
  ) {
    this.role.isAdmin.subscribe((res) => {
      this.needApprove = res;
    });
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      priority: ['1', Validators.required],
      taskGroupType: ['1', Validators.required],
      description: [''],
      isManagerApprovalRequired: [true],
      definitionOfDone: [''],
      projectId: [null],
      parentTaskGroupId: [null],
      expectedTime: [0, Validators.required],
      weight: [0],
      kpiTarget: [0 ],
      link: [null],
      latitude: [null],
      longitude: [null],
      templateId: [null],
    });
  }

  ngOnInit() {
    this.emloyeesItems = [
      {
        label: this.translate.instant('upload_branch_file'),
        command: () => this.selectFile(false),
      },
      {
        label: this.translate.instant('download_branche_file'),
        command: () => this.downloadFile(false),
      },
      {
        label: this.translate.instant('upload_employee_file'),
        command: () => this.selectFile(true),
      },
      {
        label: this.translate.instant('download_employee_file'),
        command: () => this.downloadFile(true),
      },
    ];

    if(this.data && this.data.task.taskGroupType == 6){
      this.isKpi = true
    }

    this.projectsSer.allProjects.subscribe((res) => (this.projects = res));
    if (this.projects.length == 0) {
      this.projectsSer.getAllProjects().subscribe();
    }

    if (this.data?.isDraft || this.data?.editTask) {
      if(this.data?.editTask){
        this.isEdit = true
        this.startDate = this.data.task.startDate
        let timezone = new Date().getTimezoneOffset();
        let timezoneValue = timezone > 0 ? Math.abs(timezone / 60) : -timezone / 60;
        this.endDate = new Date(this.data.task.endDate).setTime(new Date(this.data.task.endDate).getTime() + timezoneValue * 60 * 60 * 1000)
      }

      setTimeout(() => {
        this.taskGroubId = this.data?.task.id
        if(this.data?.isDraft){
          this.taskEditDetails = this.data?.task

          let users:any[] = []
          this.taskEditDetails.tasks.forEach((task:any) => {
            users.push(task.assigneeId)
          })

          this.selectUserSer.getSelectedUsers(users).subscribe((res) => {
            this.selectedUsers = res;
            this.assignees = res
            this.selectUserSer.selectedUsers$.next([]);
          });

          this.form.patchValue({
            ...this.taskEditDetails,
            taskGroupType: String(this.taskEditDetails.taskGroupType),
            priority: String(this.taskEditDetails.priority),
          });

        }else{
          this.service.getDetails(this.taskGroubId).subscribe((res:any) => {
            this.taskEditDetails = res
            if(res.expectedTime < 60){
              this.minutes = res.expectedTime
            }else{
              let totalMinutes = res.expectedTime;
              let hours = Math.floor(totalMinutes / 60);
              let minutes = totalMinutes % 60;

              this.hours = hours;
              this.minutes = minutes;
            }
            let users:any[] = []
            res.tasks.forEach((task:any) => {
              users.push(task.assigneeId)
            })
            this.selectUserSer.getSelectedUsers(users).subscribe((res) => {
              this.selectedUsers = res;
              this.assignees = res
              this.selectUserSer.selectedUsers$.next([]);
            });

            this.form.patchValue({
              ...this.taskEditDetails,
              taskGroupType: String(this.taskEditDetails.taskGroupType),
              priority: String(this.taskEditDetails.priority),
            });

          })
        }

      }, 100);
    }

    if (this.data?.isDraft) {
      let draft = this.data?.task;
      this.todos = draft.taskGroupTodoList?.map((todo: any) => {
        return todo.todoText;
      });

      this.form.patchValue({
        // title: this.data.task.title || null,
      });

      if (this.data.task?.taskGroupReporters.length > 0) {
        let reporters = this.data.task?.taskGroupReporters?.map(
          (reporter: any) => reporter.reporterId
        );
        this.selectUserSer.getSelectedUsers(reporters).subscribe((res) => {
          this.selectedReporters = res;
          this.selectUserSer.selectedUsers$.next([]);
        });
        this.reporters.push(
          ...this.data.task?.taskGroupReporters?.map((reporter: any) => {
            return reporter.reporterId;
          })
        );
      }

      if (this.data.task?.tasks.length > 0) {
        let assignees = this.data.task?.tasks?.map(
          (task: any) => task.assigneeId
        );
        this.selectUserSer.getSelectedUsers(assignees).subscribe((res) => {
          this.selectedUsers = res;
          this.selectUserSer.selectedUsers$.next([]);
        });
        this.assignees.push(
          ...this.data.task?.tasks?.map((task: any) => {
            console.log(task);

            return task.assigneeId;
          })
        );
      }
    }

    if (this.data?.isSubTask) {
      this.form.patchValue({
        parentTaskGroupId: this.data?.parentTaskGroupId,
      });
    }

    if (this.data?.mainTask || this.data?.isSubTask) {
      this.form.patchValue({
        projectId: parseInt(this.data?.projectId),
      });
    }

    if (this.data?.isMeeting) {
      this.isMeeting = true;
      setTimeout(() => {
        this.form.patchValue({
          taskGroupType: '4',
        });
        this.taskTypeChanged();
      }, 500);
    }
      // After timingForm is initialized and startDate is set, apply the latest difference
      setTimeout(() => {      
        if (this.timingForm && this.timingForm.value.startDate) {
          this.applyLatestDateDifference();
        }
        this.applyExpectedTime();
      }, 0);
    
  }
  // Save the difference between start and end date (in milliseconds)
// Save date difference between start and end dates
saveDateDifference() {
  const { startDate, endDate } = this.timingForm?.value || {};
  if (startDate && endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (!isNaN(start) && !isNaN(end) && end > start) {
      localStorage.setItem('latestTaskDateDiff', (end - start).toString());
    }
  }
}

// Apply saved date difference to set end date
applyLatestDateDifference() {
  const diff = parseInt(localStorage.getItem('latestTaskDateDiff') || '');
  if (!isNaN(diff) && this.timingForm?.value?.startDate) {
    const start = new Date(this.timingForm.value.startDate).getTime();
    if (!isNaN(start)) {
      this.timingForm.patchValue({ endDate: new Date(start + diff) });
    }
  }
}

// Save expected time
saveExpectedTime() {
  if (this.form.value.expectedTime != null) {
    localStorage.setItem('latestTaskExpectedTime', this.form.value.expectedTime.toString());
  }
}

// Apply saved expected time
applyExpectedTime() {
  const expectedTime = parseInt(localStorage.getItem('latestTaskExpectedTime') || '');
  if (!isNaN(expectedTime)) {
    this.f['expectedTime'].markAsTouched();
    this.form.patchValue({ expectedTime });
    this.hours = Math.floor(expectedTime / 60);
    this.minutes = expectedTime % 60;
  }
}  
saveDraft() {
    if (this.data?.isDraft) {
      if (this.f['title'].value) {
        const data = {
          draftId: this.data.task.draftId,
          ...this.draftData(),
          tasks: this.assignees.map((user: any) => {
            return { assigneeId: user.assigneeId || user };
          }),
          taskGroupReporters: this.reporters.map((user: any) => {
            return { reporterId: user.reporterId || user };
          }),
        };
        this.draftSer.updateDraft(data).subscribe((res: any) => {
          if (res.data && res.data.length > 0) {
            this.updateAttachmentsForDraft(res);
            this.dialog.closeAll();
          } else {
            this.draftSer.getDrafts().subscribe();
            this.dialog.closeAll();
          }
        });
      }
    } else {
      if (this.form.value.title && this.form.value.description) {
        this.draftSer.createDraft(this.draftData()).subscribe((res: any) => {
          if (res.success) {
            if (res.data && res.data.length > 0) {
              let number = 0;
              this.alert.showAlert(
                'files_uploading',
                'bg-primary',
                500000000000000
              );
              if (this.soundDescription) {
                let formData = new FormData();
                formData.append('uploadedFiles', this.soundDescription);
                if (typeof this.soundDescription.type == 'string') {
                  this.service
                    .uploadAttachmentsForDraft(formData, res.data[0].id)
                    .subscribe(() => {
                      number++;
                      if (res.data.length == number) {
                        this.alert.showAlert('draft_created');
                        this.dialog.closeAll();
                        this.draftSer.getDrafts().subscribe();
                      }
                    });
                  for (let i = 1; i < res.data.length; i++) {
                    let formData2 = new FormData();
                    formData2.append(
                      'uploadedFiles',
                      this.data.attachments[i - 1]
                    );
                    if (typeof this.data.attachments[i - 1].type == 'string') {
                      this.service
                        .uploadAttachmentsForDraft(formData2, res.data[i].id)
                        .subscribe(() => {
                          number++;
                          if (res.data.length == number) {
                            this.alert.showAlert('draft_created');
                            this.dialog.closeAll();
                            this.draftSer.getDrafts().subscribe();
                          }
                        });
                    } else {
                      number++;
                      if (res.data.length == number) {
                        this.alert.showAlert('draft_created');
                        this.dialog.closeAll();
                        this.draftSer.getDrafts().subscribe();
                      }
                    }
                  }
                }
              } else {
                for (let i = 0; i < res.data.length; i++) {
                  let formData2 = new FormData();
                  formData2.append('uploadedFiles', this.attachments[i]);
                  this.service
                    .uploadAttachmentsForDraft(formData2, res.data[i].id)
                    .subscribe(() => {
                      number++;
                      if (res.data.length == number) {
                        this.alert.showAlert('draft_created');
                        this.dialog.closeAll();
                        this.draftSer.getDrafts().subscribe();
                      }
                    });
                }
              }
            } else {
              this.alert.showAlert('draft_created');
              this.dialog.closeAll();
              this.draftSer.getDrafts().subscribe();
            }
          }
        });
      } else {
        this.f['title'].markAsTouched();
      }
    }
  }

  updateAttachmentsForDraft(res: any) {
    if (this.soundDescription) {
      let number = 0;
      let formData = new FormData();
      formData.append('uploadedFiles', this.soundDescription);
      if (typeof this.soundDescription != 'string') {
        this.service
          .uploadAttachmentsForDraft(formData, res.data[0].id)
          .subscribe(() => {
            number++;
            if (res.data.length == number) {
              this.draftSer.getDrafts().subscribe();
              this.dialog.closeAll();
            }
          });
      } else {
        number++;
        if (res.data.length == number) {
          this.draftSer.getDrafts().subscribe();
          this.dialog.closeAll();
        }
      }
      for (let i = 1; i < res.data.length; i++) {
        let formData2 = new FormData();
        formData2.append('uploadedFiles', this.attachments[i - 1]);
        if (typeof this.attachments[i - 1].type == 'string') {
          this.service
            .uploadAttachmentsForDraft(formData2, res.data[i].id)
            .subscribe(() => {
              number++;
              if (res.data.length == number) {
                this.draftSer.getDrafts().subscribe();
                this.dialog.closeAll();
              }
            });
        } else {
          number++;
          if (res.data.length == number) {
            this.draftSer.getDrafts().subscribe();
            this.dialog.closeAll();
          }
        }
      }
    } else {
      let number = 0;
      for (let i = 0; i < res.data.length; i++) {
        let formData2 = new FormData();
        formData2.append('uploadedFiles', this.attachments[i]);
        if (typeof this.attachments[i].type == 'string') {
          this.service
            .uploadAttachmentsForDraft(formData2, res.data[i].id)
            .subscribe(() => {
              number++;
              if (res.data.length == number) {
                this.draftSer.getDrafts().subscribe();
                this.dialog.closeAll();
              }
            });
        } else {
          number++;
          if (res.data.length == number) {
            this.draftSer.getDrafts().subscribe();
            this.dialog.closeAll();
          }
        }
      }
    }
  }

  submit(status?: any , edit?:any) {
    this.loading = true;
    let meetLink :any
    if(this.isMeeting){
      meetLink = 'https://meeting.taskedin.net/' + (this.form.value.link || Date.now());
    }else{
      meetLink = null
    }
    // kpiEmployeeId: [[null] ]

    // {
    //   "assigneeId": 0,
    //   "kpiEmplooyeeId": 0
    // }

    let data = {
      ...this.form.value,
      ...this.timingForm.value,
      link : meetLink,
      latitude:this.lat,
      longitude:this.long,
      taskGroubId: this.taskGroubId,
      startDate: this.datePipe.transform(
        this.timingForm.value.startDate,
        'yyyy-MM-ddTHH:mm:ss',
        'UTC'
      ),
      endDate: this.datePipe.transform(
        this.timingForm.value.endDate,
        'yyyy-MM-ddTHH:mm:ss',
        'UTC'
      ),
      endTimeForRepeat: this.timingForm.value.endTimeForRepeat,
      tasks: this.assignees,
      taskGroupReporters: !this.data?.isDraft
        ? this.reporters
        : this.reporters.map((user: any) => {
            return { reporterId: user };
          }),
      taskDepartments: this.assigneesDepartment,
      taskManagers: this.assigneesManager,
      taskJobTitles: this.assigneesJobTitles,
      taskPlaces: this.assigneesPlaces,
      taskLevels: this.assigneesLevels,
      reporterDepartments: this.reportersDepartment,
      taskGroupAttachments: [
        ...this.getSoundDescription(),
        ...this.getAttachments(),
      ],
      taskGroupTodoList: this.todos.map((todo: any) => {
        return { todoText: todo };
      }),
      dynamicProps: this.props.map((prop: any) => {
        return { name: prop.name , dataType : prop.dataType };
      }),
    };

    if(this.selectedKpis.length > 0){
      data.kpiEmployeeId  = this.selectedKpis
    }

    if (this.isMeeting) {
      let currentUser: any = localStorage.getItem('id');
      let isUser: any = data.tasks.find((item: any) => {
        return item.assigneeId == parseInt(currentUser);
      });
      if (!isUser) {
        data.tasks.push({ assigneeId: parseInt(currentUser) });
      }
    }

    if(this.data?.editTask){
      let users:any[] = []
      data.tasks.forEach((user:any) => {
        users.push({assigneeId : user.assigneeId})
        if(users.length == data.tasks.length){
          data.tasks = users
          this.service.editTask(data).subscribe((res: any) => {
            if (res.success) {
              if (res.data.length > 0) {
                this.sendAttachments(res);
              } else {
                this.afterTaskCreation(status);
              }
            } else {
              this.loading = false;
            }
          });
        }
      });
    }else{
      this.service.createTask(data).subscribe((res: any) => {
        if (res.success) {
          if (res.data.length > 0) {
            this.sendAttachments(res);
          } else {
            this.afterTaskCreation(status);
          }
        } else {
          this.loading = false;
        }
      });
    }
    this.saveDateDifference();
    this.saveExpectedTime();
  }

  afterTaskCreation(status?: any) {
    this.alert.showAlert('success');
    if (this.data?.isSubTask) {
      this.projectsSer
        .getHierarchy(
          this.data?.projectId,
          this.data?.parentTaskGroupId,
          this.data?.index
        )
        .subscribe();
    }
    // main task fot project
    if (this.data?.mainTask) {
      this.projectsSer.getHierarchy(this.data?.projectId).subscribe();
    }

    if (this.data?.isDraft) {
      this.draftSer
        .deleteDraft(this.data?.task.draftId)
        .subscribe((res: any) => {
          if (res.success) {
            this.draftSer.getDrafts().subscribe();
          }
        });
    }

    if (this.data?.isMeeting) {
      this.meetingSer.hasChanged.next(true);
    }
    if (status) {
      this.form.patchValue({
        title: '',
        link: null,
        latitude: null,
        longitude: null,
        priority: '1',
        description: '',
        isManagerApprovalRequired: true,
        definitionOfDone: '',
        projectId: null,
        parentTaskGroupId: null,

      });
      this.loading = false;
    } else {
      this.dialogRef.close(true);
    }
  }

  sendAttachments(res: any) {
    let number = 0;
    this.alert.showAlert('files_uploading', 'bg-primary', 500000000000000);
    const uploadAttachment = (file: any, id: any) => {
      let formData = new FormData();
      formData.append('uploadedFiles', file);
      this.service.uploadAttachments(formData, id).subscribe(() => {
        number++;
        if (res.data.length == number) {
          this.afterTaskCreation();
        }
      });
    };

    if (this.soundDescription) {
      uploadAttachment(this.soundDescription, res.data[0].id);
    }

    for (let i = this.soundDescription ? 1 : 0; i < res.data.length; i++) {
      if (
        typeof this.attachments[i - (this.soundDescription ? 1 : 0)].type ===
        'string'
      ) {
        uploadAttachment(
          this.attachments[i - (this.soundDescription ? 1 : 0)],
          res.data[i].id
        );
      } else {
        number++;
        if (res.data.length == number) {
          this.afterTaskCreation();
        }
      }
    }
  }

  getAssignees(assignees: any) {

    this.needApprove = false;
    this.assignees = assignees.map((assignee: any) => {
      if (assignee.id == localStorage.getItem('id')) {
        this.needApprove = true;
      }
      return { assigneeId: assignee.id };
    });
  }

  getAssigneesDepartment(departments: any) {
    this.assigneesDepartment = departments.map((departmentId: any) => {
      return { id: departmentId };
    });
  }

  getAssigneesManager(managers: any) {
    this.assigneesManager = managers.map((managerId: any) => {
      return { id: managerId };
    });
  }
  getAssigneesPlaces(places: any) {
    this.assigneesPlaces = places.map((placesId: any) => {
      return { id: placesId };
    });
  }
  getAssigneesLevels(levels: any) {
    this.assigneesLevels = levels.map((levelId: any) => {
      return { id: levelId };
    });
  }
  getAssigneesJobTitles(jobs: any) {
    this.assigneesJobTitles = jobs.map((jobId: any) => {
      return { id: jobId };
    });
  }

  getReporters(reporters: any) {
    this.reporters = reporters.map((reporter: any) => {
      return { reporterId: reporter.id };
    });
  }

  getReportersDepartment(departments: any) {
    this.reportersDepartment = departments.map((departmentId: any) => {
      return { id: departmentId };
    });
  }

  taskTypeChanged() {
    const taskType = this.f['taskGroupType'].value;
    this.isMeeting = taskType === '4';
    this.isLocation = taskType === '5';
    this.isKpi = taskType === '6';
    this.isSignature = taskType === '8';
    this.isTicketing = taskType === '9';
    if(this.isKpi){
      this.needApprove == false
      let kpiTarget = this.form.get('kpiTarget')
      let weight = this.form.get('weight')
      weight.setValidators([Validators.max(100)]);
      kpiTarget.setValidators([Validators.required , [Validators.min(1)]]);
    }
    if (taskType !== '4' && taskType !== '5') {
      this.locationComponent.resetLocation();
    } else if (taskType === '4') {
      setTimeout(() => {
        this.form.patchValue({
          link: 'meeting-' + Date.now()
        });
      }, 0);
    } else {
      this.locationComponent.getCurrentLocation();
    }
    if (taskType === '8') {
      this.isSignature = true;
      this.minutes = 15;
      this.hours = 0;
      this.form.patchValue({ expectedTime: 1 });
    }
  }

  setExpectedTime(time: any) {
    this.f['expectedTime'].markAsTouched();
    this.form.patchValue({
      expectedTime:time,
    });

  }

  get f() {
    return this.form.controls;
  }

  getProps(props: any) {
    this.props = props;
    setTimeout(() => {
      this.elm.nativeElement.querySelector(
        '.mat-mdc-dialog-content'
      ).scrollTop = this.elm.nativeElement.querySelector(
        '.mat-mdc-dialog-content'
      ).scrollHeight;
    }, 0);
  }
  getTodos(todos: any) {
    this.todos = todos;
    console.log(todos , 'todos');

    setTimeout(() => {
      this.elm.nativeElement.querySelector(
        '.mat-mdc-dialog-content'
      ).scrollTop = this.elm.nativeElement.querySelector(
        '.mat-mdc-dialog-content'
      ).scrollHeight;
    }, 0);
  }

  getAttachments() {
    let spaceId = localStorage.getItem('space-id');
    return this.attachments
      .map((file: any) => {
        const isNewFile = typeof file.type === 'string';
        if (file.type == 5) return undefined;
        let fileType = 6;
        let filePath = isNewFile
          ? file.filePath
          : 'Companies/' + spaceId + '/Attachments\\' + file.name;
        if (file.type == 2 || (isNewFile && file.type.includes('image')))
          fileType = 2;
        else if (file.type == 4 || (isNewFile && file.type.includes('video')))
          fileType = 4;
        else if (file.type == 1 || (isNewFile && file.type.includes('text')))
          fileType = 1;
        else if (file.type == 3 || (isNewFile && file.type.includes('audio')))
          fileType = 3;
        return {
          filePath,
          contentType: 'string',
          fileName: file.name,
          fileSize: file.fileSize,
          fileType,
        };
      })
      .filter(Boolean);
  }

  getSoundDescription() {
    if (typeof this.soundDescription == 'string') {
      return [
        {
          filePath: this.data?.task.taskGroupAttachments[0].filePath,
          contentType: 'string',
          fileName: this.data?.task.taskGroupAttachments[0].fileName,
          fileSize: this.data?.task.taskGroupAttachments[0].fileSize,
          fileType: 5,
        },
      ];
    } else {
      if (this.soundDescription) {
        return [
          {
            filePath: `Khaled/Attachments/${this.soundDescription.size}`,
            contentType: 'string',
            fileName: this.soundDescription.size.toString(),
            fileSize: this.soundDescription.size,
            fileType: 5,
          },
        ];
      } else {
        return [];
      }
    }
  }

  draftData() {
    let data = {
      ...this.form.value,
      expectedTime: 0,
      // ...this.locationForm.value,
      taskGroupAttachments: [
        ...this.getSoundDescription(),
        ...this.getAttachments(),
      ],
      tasks: this.assignees,
      taskGroupReporters: this.reporters,
      taskGroupTodoList: this.todos.map((todo: any) => {
        return { todoText: todo };
      }),
    };

    return data;
  }

  editableData(task: any) {
    return {
      title: task.title || null,
      priority: String(task.priority) || null,
      taskGroupType: String(task.taskGroupType) || null,
      description: task.description || null,
      definitionOfDone: task.definitionOfDone || null,
    };
  }
  showMore() {
    this.more = !this.more;
    this.toggleShowMoreClass();
  }

  toggleShowMoreClass() {
    const dialogElement = document.querySelector('.create-task-dialog');
    if (this.more) {
      dialogElement?.classList.add('show-more');
    } else {
      dialogElement?.classList.remove('show-more');
    }
  }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '5rem',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
  };

  meetingLocation($event: any) {
    this.isMeetingLocation = !this.isMeetingLocation
    if(!this.isMeetingLocation){
      this.lat = null
      this.long = null
    }
  }

  getMapData($event: any) {
    this.lat = $event.lat
    this.long = $event.long
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!allowedTypes.includes(file.type)) {
        return;
      }
      this.selectedFile = file;
      setTimeout(() => {
        this.onSubmit(this.employeeMode)
      }, 0);
    }
  }

  downloadFile(employeeMode:boolean){
    let url:any
    if(employeeMode){
      url = this.url + 'api/TaskGroups/download-template'
    }else{
      url = this.url + 'api/TaskGroups/download-templateForBranch'
    }

    window.open(url , '_blank')
  }
  selectFile(employeeMode:boolean) {
    this.employeeMode = employeeMode;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onSubmit(employeeMode:boolean) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.service.getAssineesFile(formData , employeeMode).subscribe((res:any) =>{
      if(res.success){
        this.alert.showAlert('success')
        this.uploadFile = true
        setTimeout(() => {
          this.uploadFile = false
        }, 0);
        if(employeeMode){
          this.empFileContent = res.data
          res.data.forEach((user: any) => {
            const isUserExists = this.assignees.find((selectedUser: any) => selectedUser.assigneeId === user.assigneeId);
            if (!isUserExists) {
              this.assignees.push(user);
            }
          });
        }else{
          this.branchFileContent = res.data
          res.data.forEach((user: any) => {
            const isUserExists = this.assignees.find((selectedUser: any) => selectedUser.assigneeId === user.assigneeId);
            if (!isUserExists) {
              this.assignees.push(user);
            }
          });
        }
      }
    });
  }

  getTemplates() {
    let ref = this.dialog.open(SelectTemplateComponent, {
      width: '500px',
      data: {
        TaskGroupType:this.form.value.taskGroupType
      }
    })
    ref.afterClosed().subscribe((selectedTemplate: any) => {
      if (selectedTemplate) {
        this.selectedTemplate = selectedTemplate
        this.stageMode = true
        let params = new HttpParams().set('templateId', selectedTemplate.id)
        this.templateServ.getTemplateStages(params).subscribe((res:any) => {
          this.stages = res.data
        })
        this.props = selectedTemplate.templateTaskDynamicProperties
        this.todos = selectedTemplate.taskTemplateTodoList.map((todo:any) => {
          return todo.todoText
        })
        this.form.patchValue({
          ...selectedTemplate,
          templateId:selectedTemplate.id,
          expectedTime:30
        })
      }
    });
  }


}
