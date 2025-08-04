import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArabicNumbersPipe } from '../../../../core/pipes/arabic-numbers.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NotFoundComponent } from '../../../../core/components/not-found.component';
import { AllTasksService } from 'src/app/core/services/all-tasks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'team-tasks-statistics',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgApexchartsModule,
    NotFoundComponent,
  ],
  templateUrl: './team-tasks-statistics.component.html',
  styleUrls: ['./team-tasks-statistics.component.scss'],
})
export class TeamTasksStatisticsComponent implements OnChanges {
  @Input() data: any;
  @Input() filterData: any;
  @Input() label: any;
  @Input() projectId!: number;
  startDate: any | Date = new Date(new Date().setDate(1));
  endDate: any | Date = new Date(new Date().setMonth(new Date().getMonth() + 1, 0));
  chartOptions: any;
  chatValues: any = [];
  lineChartOptions: any;
  notFound: boolean = false;

  constructor(
    private translate: TranslateService,
    private ArabicNumber: ArabicNumbersPipe,
    private allTasksService: AllTasksService,
    private router: Router
  ) {
    this.lineChartOptions = {
      series: [
        {
          name: 'Series A',
          data: [20, 20],
        },
        {
          name: 'Series B',
          data: [20, 20],
        },
        {
          name: 'Series C',
          data: [20, 20],
        },
        {
          name: 'Series D',
          data: [20, 20],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%', // Adjust this value to control the spacing between bars
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      xaxis: {
        categories: [
          'Group 1',
          'Group 1',
          'Group 2',
          'Group 2',
          'Group 3',
          'Group 3',
        ],
      },
      grid: {
        show: false,
      },
      colors: [
        '#D8B4FE',
        '#7C3AED',
        '#FCD34D',
        '#F59E0B',
        '#6EE7B7',
        '#10B981',
      ],
    };
    this.filterData = null;
  }

  generateColors(numColors: number): string[] {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      // Generate a random hex color
      colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    return colors;
  }

  ngOnChanges(changes: any) {
    if (changes.data) {
      this.chatValues = [
        this.data.newTasks.totalCount,
        this.data.inprogressTasks.totalCount,
        this.data.completedTasks.totalCount,
      ];
      this.triggerChart();
    }
  }

  triggerChart() {
    let colors = ['#7b58ca', '#F69E42', '#29CC99', '#F5f5f5'];
    if (this.chatValues.every((value: number) => value == 0)) {
      this.notFound = true;
    }
    this.chartOptions = {
      series: this.chatValues,
      colors: colors,
      dataLabels: {
        enabled: true,
        fontSize: '15px',
        formatter: (val: any) => {
          return this.ArabicNumber.transform(val.toFixed()) + '%';
        },
      },
      chart: {
        type: 'donut',
        width: '250px',
      },
      labels: [
        this.translate.instant('new'),
        this.translate.instant('in_progress'),
        this.translate.instant('completed'),
      ],
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          customScale: 1,
          donut: {
            size: '64%',
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: this.translate.instant('total'),
                fontSize: '2rem',
                fontWeight: 600,
                formatter: (val: any) => {
                  let total = val.globals.seriesTotals.reduce(
                    (a: any, b: any) => {
                      return a + b;
                    },
                    0
                  );
                  return (
                    this.ArabicNumber.transform(total) +
                    ' ' +
                    this.translate.instant('task')
                  );
                },
              },
            },
          },
        },
      },
    };
  }

  filter(type: string) {
    // this.startDate
    console.log(
      this.filterData
    );

    // this.allTasksService.tasks.next([]);
    this.allTasksService.resetFilter();
    this.allTasksService.loading.next(true);
    this.allTasksService.assigneeState.next(true);

    if (this.projectId) {
      this.allTasksService.project.next([this.projectId]);
    } else {
      if (this.filterData != null) {
        if (this.filterData.startDate!) {
          this.allTasksService.dateFrom.next(this.filterData.startDate);
        }
        if (this.filterData.startDate) {
          this.allTasksService.dateTo.next(this.filterData.endDate);
        }
      } else {
        this.allTasksService.dateTo.next(this.endDate);
        this.allTasksService.dateFrom.next(this.startDate);
      }
    }

    this.allTasksService.search.next('');

    if (type == 'new') {                        /** new **/
      this.allTasksService.taskStatus.next(['1']);
    } else if (type == 'new_ontime') {
      this.allTasksService.taskStatus.next(['1']);
      this.allTasksService.isOverdue.next(false);
    } else if (type == 'new_overDue') {
      this.allTasksService.taskStatus.next(['1']);
      this.allTasksService.isOverdue.next(true);
    }

    else if (type == 'in_progress_ontime') {  /** inprogress **/
      this.allTasksService.taskStatus.next(['3']);
      this.allTasksService.isOverdue.next(false);
    }else if (type == 'in_progress_overDue') {
      this.allTasksService.taskStatus.next(['3']);
      this.allTasksService.isOverdue.next(true);
    }  else if (type == 'in_progress') {
      this.allTasksService.taskStatus.next(['3']);
    }

    else if (type == 'completed') {           /** completed **/
      this.allTasksService.taskStatus.next(['2']);
    } else if (type == 'completed_ontime') {
      this.allTasksService.taskStatus.next(['2']);
      this.allTasksService.isOverdue.next(false);
    } else if (type == 'completed_overDue') {
      this.allTasksService.taskStatus.next(['2']);
      this.allTasksService.isOverdue.next(true);
    }

    if (this.filterData) {
      if (this.filterData.assignees?.length > 0) {
        this.allTasksService.assignees.next(this.filterData.assignees)
      }

      if (this.filterData.type) {
        this.allTasksService.taskType.next(this.filterData.type);
      }

      if (this.filterData.departments?.length > 0) {
        this.allTasksService.department.next(this.filterData.departments);
      }

      if (this.filterData.priority) {
        this.allTasksService.priority.next(this.filterData.priority);
      }

      if (this.filterData.project) {
        this.allTasksService.project.next(this.filterData.project);
      }
    }
    // this.allTasksService.getInbox().subscribe();
    console.log(this.filterData);

    this.router.navigate(['/tasks/all-tasks']);
  }
}
