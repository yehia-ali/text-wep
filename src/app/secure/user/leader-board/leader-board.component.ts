import { FormsModule } from '@angular/forms';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { LayoutComponent } from 'src/app/core/components/layout.component';
import { UserWithImageComponent } from 'src/app/core/components/user-with-image/user-with-image.component';
import { ArabicNumbersPipe } from 'src/app/core/pipes/arabic-numbers.pipe';
import { UserNavbarComponent } from "../../../core/components/user-navbar/user-navbar.component";
import { LeaderBoardService } from 'src/app/core/services/leader-board.service';
import { HttpParams } from '@angular/common/http';
import { LoadingComponent } from "../../../core/components/loading.component";
import { NotFoundComponent } from "../../../core/components/not-found.component";
import { SearchComponent } from "../../../core/filters/search.component";
import { environment } from 'src/environments/environment';
import { ArabicDatePipe } from "../../../core/pipes/arabic-date.pipe";
import { ArabicTimePipe } from "../../../core/pipes/arabic-time.pipe";

@Component({
  selector: 'leader-board',
  templateUrl: './leader-board.component.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None ,
  styleUrls: ['./leader-board.component.scss'],
  imports: [
    NgxPaginationModule,
    FormsModule,
    CommonModule,
    LayoutComponent,
    TranslateModule,
    UserWithImageComponent,
    ArabicNumbersPipe,
    UserNavbarComponent,
    LoadingComponent,
    NotFoundComponent,
    SearchComponent,
    ArabicDatePipe,
    ArabicTimePipe
],
})
export class LeaderBoardComponent {
  totalItems: any;
  limit: any = 10;
  page:any = 1
  searchValue: any;
  leaderBoard: any[] = [];
  topThree: any[] = [];
  startDate:any;
  endDate: any;

  selectedDateFilter = 1
  dateFilterList = [
    {number:1 , name : 'monthly'},
    {number:2 , name : 'quarter'},
    {number:3 , name : 'yearly'},
  ]
  months = [
    { month: 1,  name: 'january',   monthDays: 31 },
    { month: 2,  name: 'february',  monthDays: 29 },
    { month: 3,  name: 'march',     monthDays: 31 },
    { month: 4,  name: 'april',     monthDays: 30 },
    { month: 5,  name: 'may',       monthDays: 31 },
    { month: 6,  name: 'june',      monthDays: 30 },
    { month: 7,  name: 'july',      monthDays: 31 },
    { month: 8,  name: 'august',    monthDays: 31 },
    { month: 9,  name: 'september', monthDays: 30 },
    { month: 10, name: 'october',   monthDays: 31 },
    { month: 11, name: 'november',  monthDays: 30 },
    { month: 12, name: 'december',  monthDays: 31 }
  ];
  quarters = [
    { start: 1,  end:3,  name: 'first_quarter',  monthDays: 31 },
    { start: 4,  end:6,  name: 'second_quarter', monthDays: 30 },
    { start: 7,  end:9,  name: 'third_quarter',  monthDays: 30 },
    { start: 10, end:12, name: 'fourth_quarter', monthDays: 31 },
  ];
  defultKPI = {
    tasksKPIValue: 20.00,
    rateKPIValue: 20.00,
    managerRateKPIValue: 20.00,
    timeSheetKPIValue: 20.00,
    attendanceKPIValue: 20.00,
  }
  currentMonth = this.months[new Date().getMonth()]
  currentCMonth = this.months[new Date().getMonth()]
  currentKPI:any
  loading: boolean;
  @ViewChild('leaderBoardList', { static: true }) leaderBoardList!: ElementRef;
  moreUsersStatus = true;
  quarterStartMonth: number | any;
  quarterCStartMonth: number | any;
url = environment.apiUrl;
spaceId = localStorage.getItem('space-id');
  urlDetails :any
  refresh: any;
  casheTime: any;
  constructor(
    private service: LeaderBoardService,
    private datePipe: DatePipe,
  ) {
    this.startDate = this.datePipe.transform(new Date() , 'yyyy-MM-01')
    this.endDate = this.datePipe.transform(new Date() , 'yyyy-MM-dd')
  }

  ngOnInit() {
    this.loading = true
    this.service.getKPI().subscribe((res:any) => {
      if(!res){
        this.setKpiValues(this.defultKPI)
      }else{
        this.currentKPI = res;
        this.getLeaderBoard()
      }
    })
  }

  ngAfterViewInit() {
    if(this.leaderBoardList){
      this.leaderBoardList.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onScroll(event: any): void {
    // const scrollTop = event.target.scrollTop;
    // const scrollHeight = event.target.scrollHeight;
    // const clientHeight = event.target.clientHeight;

    // if ((scrollTop + clientHeight + 10) >= scrollHeight && this.moreUsersStatus) {
    //   this.page += 1
    //   this.getLeaderBoard()
    //   setTimeout(() => {
    //     this.moreUsersStatus = false
    //   }, 0);
    // }
  }



  setKpiValues(data:any){
    this.service.setKPI(data).subscribe((res:any) => {
      if(res.success){
        this.getKpiValues()
      }
    })
  }

  getKpiValues(){
    this.loading = true
    this.service.getKPI().subscribe((res:any) => {
        this.currentKPI = res
        this.getLeaderBoard()
    })
  }

  getLeaderBoard(){
    this.loading = true
    let params = new HttpParams()
    this.urlDetails = `api/Tasks/LeaderBoardExcel?from=${this.startDate}&to=${this.endDate}&spaceId=${this.spaceId}`
    params = params.set('from' ,this.startDate).set('to' , this.endDate)
    if(this.searchValue){
      params = params.set('search' , this.searchValue)
    }
    if(this.refresh){
      params = params.set('Recache' , this.refresh)
    }
    this.service.getLeaderBoardCached(params).subscribe((res:any) => {
      this.loading = false
      this.casheTime = this.datePipe.transform(res.cacheTime , 'yyyy-MM-ddTHH:mm:ss' , 'UTC')
      res.data.forEach((user:any) => {
        this.leaderBoard.push(user)
      });

      this.totalItems = res.totalItems

      if(this.page >= (this.totalItems / this.limit)){
        this.moreUsersStatus = false
      }else{
        this.moreUsersStatus = true
      }

      if (res.data.length >= 3 && this.topThree.length == 0) {
        this.topThree = [
          {data:res.data[1] , number:2},
          {data:res.data[0] , number:1},
          {data:res.data[2] , number:3},
        ];
      }

    }, (error:any) => {
      console.log(error);

      this.getLeaderBoard()
    })
  }

  dateRange(type: any) {
    const currentDate = new Date(); // تاريخ اليوم
    let startDate: Date;
    let endDate: Date;
    this.page = 1
    this.topThree = []
    this.leaderBoard = []
    this.currentMonth = this.months[new Date().getMonth()]
    switch (type) {
      case 1: // بداية الشهر الحالي إلى اليوم الحالي
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = currentDate;
        this.selectedDateFilter = 1
      break;

      case 2: // الربع الحالي من السنة
        const currentMonth = currentDate.getMonth(); // الشهر الحالي (من 0 إلى 11)
        this.quarterStartMonth = Math.floor(currentMonth / 3) * 3; // تحديد بداية الربع
        this.quarterCStartMonth = Math.floor(currentMonth / 3) * 3; // تحديد بداية الربع

        startDate = new Date(currentDate.getFullYear(), this.quarterStartMonth, 1);
        endDate = currentDate;
        this.selectedDateFilter = 2
      break;

      case 3:
        startDate = new Date(currentDate.getFullYear(), 0 , 1);
        endDate = currentDate;
        this.selectedDateFilter = 3
      break;
      default:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = currentDate;
        this.selectedDateFilter = 1
    }
    this.startDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    this.getLeaderBoard()
  }
  monthFilter(type: any) {
    let date = new Date();
    this.page = 1
    this.topThree = []
    this.leaderBoard = []
    this.currentMonth = type
    date.setMonth(type.month -1); // لضبط الشهر (subtract 1 لأن الأشهر تبدأ من 0)
    date.setDate(type.monthDays); // لضبط اليوم (setDate بدلًا من setDay)
    this.startDate = this.datePipe.transform(date, 'yyyy-MM-01');
    this.endDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.getLeaderBoard()
  }

  quarterFilter(type: any) {
    let start = new Date();
    let end = new Date();

    this.page = 1
    this.topThree = []
    this.leaderBoard = []

    this.currentMonth = type
    this.quarterStartMonth = type.start - 1
    start.setMonth(type.start -1);
    end.setMonth(type.end -1);
    end.setDate(type.monthDays);

    this.startDate = this.datePipe.transform(start, 'yyyy-MM-01');
    this.endDate = this.datePipe.transform(end, 'yyyy-MM-dd');
    this.getLeaderBoard()
  }

  getByDepartment(event: any) {
  }

  pageChanged($event: number) {
    this.page = $event
    this.getLeaderBoard()
  }

  changeLimit() {
    this.getLeaderBoard()
  }

  search($event: any) {
    this.searchValue = $event;
    this.page = 1
    this.topThree = []
    this.leaderBoard = []
    this.getLeaderBoard()
  }

  refreshBtn() {
    this.refresh = true;
    this.page = 1
    this.topThree = []
    this.leaderBoard = []
    this.getLeaderBoard()
    setTimeout(() => {
      this.refresh = false
    }, 0);
  }

}
