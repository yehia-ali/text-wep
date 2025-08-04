import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormatDate} from "../functions/formatDate";
import { monthFormat } from '../functions/monthFotmat';

@Injectable({
  providedIn: 'root'
})
export abstract class FiltersService {
  hasChanged = new BehaviorSubject<boolean>(false);
  loading = new BehaviorSubject<boolean>(true);
  search = new BehaviorSubject<string>('');
  page = new BehaviorSubject<number>(1);
  limit = new BehaviorSubject<number>(15);
  currentPage = new BehaviorSubject<number>(1);
  taskStatus = new BehaviorSubject<any>([]);
  taskType = new BehaviorSubject<any>([]);
  priority = new BehaviorSubject<any>([]);
  rated = new BehaviorSubject<any>(null);
  isOverdue = new BehaviorSubject<any>(null);
  dateFrom = new BehaviorSubject<any>(null);
  dateTo = new BehaviorSubject<any>(null);
  walletFrom = new BehaviorSubject<any>(null);
  walletTo = new BehaviorSubject<any>(null);
  orderKey = new BehaviorSubject<any>(0);
  orderDirection = new BehaviorSubject<any>(0);
  voteStatus = new BehaviorSubject<any>([]);
  voteCanceled = new BehaviorSubject<any>(null);
  creators = new BehaviorSubject<any>([]);
  assignees = new BehaviorSubject<any>([]);
  department = new BehaviorSubject<any>([]);
  assigneeState = new BehaviorSubject<any>(null);
  rateValue = new BehaviorSubject<any>([]);
  managers = new BehaviorSubject<any>([]);
  type = new BehaviorSubject<any>(null);
  meta = new BehaviorSubject<any>(null);
  balanceMeta = new BehaviorSubject<any>(null);
  amountFrom = new BehaviorSubject<any>(null);
  amountTo = new BehaviorSubject<any>(null);
  transactionType = new BehaviorSubject<any>(null);
  sessionStatus = new BehaviorSubject<any>(null);
  role = new BehaviorSubject<any>(null);
  attendanceType: any = new BehaviorSubject(null);
  project = new BehaviorSubject<any>([]);
  repeatPeriod = new BehaviorSubject<any>(null)
  levels = new BehaviorSubject<any>([]);
  penaltyTypeId = new BehaviorSubject<any>(null)
  month = new BehaviorSubject<any>(null)  
  employeeId = new BehaviorSubject<any>(null)
  year = new BehaviorSubject<any>(null)
  userId = new BehaviorSubject<any>(null)
  selectedUser = new BehaviorSubject<any>(null)
  protected constructor() {
  }

  params(url: any, type?: string) {
    this.getSearch(url);
    this.getPage(url);
    this.getLimit(url);
    this.getTaskStatus(url);
    this.getTaskType(url);
    this.getPriority(url);
    this.getRated(url);
    this.getOverdue(url);
    this.getSort(url, type);
    this.getVoteStatus(url);
    this.getVoteCanceled(url);
    this.getCreator(url);
    this.getAssignee(url);
    this.getDepartments(url, type);
    this.getAssigneeState(url, type);
    this.getDateFrom(url, type);
    this.getDateTo(url, type);
    this.isRatedWithValue(url);
    this.getManager(url, type);
    this.getRole(url);
    this.getAttendnaceType(url);
    this.getProjects(url);
    this.getRepeatPeroid(url)
    this.getPenaltyTypeId(url)
    this.getMonth(url)
    this.getWalletType(url);
    this.getAmount(url);
    this.getTransactionType(url);
    this.getSessionStatus(url);
    this.getWalletFrom(url);
    this.getWalletTo(url);
    this.getLevels(url);
    this.getEmployeeId(url);
    this.getYear(url);
    this.getUserId(url);
    this.getSelectedUser(url);
  }

  getTransactionType(url: any) {
    typeof (this.transactionType.value) == 'number' && url.searchParams.append('FilterType', this.transactionType.value)
  }

  getAmount(url: any) {
    this.amountFrom.value && url.searchParams.append('AmountFrom', this.amountFrom.value)
    this.amountTo.value && url.searchParams.append('AmountTo', this.amountTo.value)
  }

  getWalletType(url: any) {
    typeof (this.type.value) === 'number' && url.searchParams.append('PaymentType', this.type.value)
  }

  getPage(url: any) {
    url.searchParams.append('page', String(this.page.value))
  }

  getLimit(url: any) {
    url.searchParams.append('limit', String(this.limit.value))
  }

  getSearch(url: any) {
    this.search.value && url.searchParams.append('search', this.search.value)
  }


  getTaskStatus(url: any) {
    this.taskStatus.value.length > 0 && this.taskStatus.value.forEach((status: number) => {
      url.searchParams.append('states', String(status))
    })
  }

  getTaskType(url: any) {
    this.taskType.value.length > 0 && this.taskType.value.forEach((status: number) => {
      url.searchParams.append('TaskGroupType', String(status))
    })
  }

  getPriority(url: any) {
    this.priority.value.length > 0 && this.priority.value.forEach((status: number) => {
      url.searchParams.append('priorities', String(status))
    })
  }

  getRated(url: any) {
    typeof this.rated.value == 'boolean' && url.searchParams.append('isRated', this.rated.value)
  }

  getOverdue(url: any) {
    typeof this.isOverdue.value == 'boolean' && url.searchParams.append('isOverDue', this.isOverdue.value)
  }

  getDateFrom(url: any, type?: string) {
    this.dateFrom.value && url.searchParams.append(type == 'all-users' ? 'creationDateFrom' : type == 'users-attendance' ? 'dateFrom' : type == 'team-balance' ? 'from' : 'startDateFrom', FormatDate(this.dateFrom.value))
  }

  getDateTo(url: any, type?: string) {
    this.dateTo.value && url.searchParams.append(type == 'all-users' ? 'creationDateTo' : type == 'users-attendance' ? 'dateTo' : type == 'team-balance' ? 'to' : 'startDateTo', FormatDate(this.dateTo.value) || '')
  }

  getCreator(url: any) {
    this.creators.value.length > 0 && this.creators.value.forEach((creator: any) => {
      url.searchParams.append('creators', creator.id)
    })
  }

  getAssignee(url: any) {
    this.assignees.value.length > 0 && this.assignees.value.forEach((assignees: any) => {
      url.searchParams.append('assignees', assignees.id)
    })
  }

  getDepartments(url: any, type?: string) {
    this.department.value.length > 0 && this.department.value.forEach((department: any) => {
      url.searchParams.append(type == 'all-tasks' ? 'assigneeDepartments' : type == 'users-attendance' ? 'employeeDepartments' :type == 'team-balance' ? 'departmentsId' : 'departments', department)
    })
  }

  getAssigneeState(url: any, type?: string) {
    typeof this.assigneeState.value == 'boolean' && url.searchParams.append(type == 'all-tasks' ? 'assigneeIsActive' : 'isActive', this.assigneeState.value)
  }

  isRatedWithValue(url: any) {
    this.rateValue.value.length > 0 && url.searchParams.append('isRated', 'true');
    this.rateValue.value.length > 0 && this.rateValue.value.map((value: any) => {
      url.searchParams.append('rate', value)
    })
  }

  getManager(url: any, type?: string) {
    this.managers.value.length > 0 && this.managers.value.forEach((manager: any) => {
      url.searchParams.append(type == 'users-attendance' ? 'employeeManagers' : type == 'team-balance'?'managersIdsId': 'managers', manager.id)
    })
  }

  getRole(url: any) {
    this.role.value && url.searchParams.append('roleId', this.role.value)
  }

  getAttendnaceType(url: any) {
    this.attendanceType.value && url.searchParams.append('attendanceStatus', this.attendanceType.value)
  }

  getProjects(url: any) {
    this.project.value.length > 0 && this.project.value.forEach((project: any) => {
      url.searchParams.append('projectIds', project)
    })
  }
  getRepeatPeroid(url: any) {
    if (this.repeatPeriod.value == 6) {
      url.searchParams.append('isRepeated', false);
    } else if (this.repeatPeriod.value == 7) {
      url.searchParams.append('isRepeated', true);
      url.searchParams.append('taskStopedRepeated', 1);
    } else {
      this.repeatPeriod.value && url.searchParams.append('isRepeated', true);
      this.repeatPeriod.value && url.searchParams.append('taskRepeatedPeriod', [this.repeatPeriod.value])
    }
  }


  getWalletFrom(url: any) {
    this.walletFrom.value && url.searchParams.append('creationDateFrom', FormatDate(this.walletFrom.value))
  }
  getPenaltyTypeId(url: any) {
    this.penaltyTypeId.value && url.searchParams.append('PenalityTypeId', this.penaltyTypeId.value.id)
  }
  getWalletTo(url: any) {
    this.walletTo.value && url.searchParams.append('creationDateTo', FormatDate(this.walletTo.value) || '')
  }

  getSort(url: URL, type?: string) {
    if (type !== 'report-table') {
      url.searchParams.append('OrderKey', String(this.orderKey.value));
    } else {
      this.orderKey.value.length > 0 && this.orderKey.value.forEach((key: any, i: any) => {
        url.searchParams.append('orderKey' + (i + 1), key)
      });
    }
    url.searchParams.append('OrderDirection', String(this.orderDirection.value));
  }

  getVoteStatus(url: any) {
    this.voteStatus.value.length > 0 && this.voteStatus.value.forEach((status: number) => {
      url.searchParams.append('voteStates', String(status))
    })
  }

  getVoteCanceled(url: any) {
    this.voteCanceled.value && url.searchParams.append('voteFormStates', this.voteCanceled.value)
  }

  getSessionStatus(url: any) {
    // this.sessionStatus.value.length > 0 && this.sessionStatus.value.forEach((status: number) => {
    //   url.searchParams.append('sessionAttendeeStatues', String(status))
    // })
    this.sessionStatus.value && url.searchParams.append('sessionAttendeeStatues', this.sessionStatus.value)

  }
  getMonth(url: any) {
    this.month.value && url.searchParams.append('month', monthFormat(this.month.value))
  }
  getLevels(url: any) {
    this.levels.value.length > 0 && this.levels.value.forEach((levels: any) => {
      url.searchParams.append('LevelsIds', levels)
    })
  }
  getEmployeeId(url: any) {
    this.employeeId.value && url.searchParams.append('EmployeeId', this.employeeId.value)
  }
  getYear(url: any) {
    this.year.value && url.searchParams.append('Year', this.year.value)
  }
  getUserId(url: any) { 
    this.userId.value && url.searchParams.append('userId', this.userId.value)
  }
  getSelectedUser(url: any) {
    this.selectedUser.value && url.searchParams.append('userId', this.selectedUser.value)
  }
  setMeta(res: any) {
    let meta = {
      pageSize: res.data.pageSize,
      totalItems: res.data.totalItems,
      totalPages: res.data.totalPages,
      totalUnSeen: res.data.totalUnSeen,
      currentPage: res.data.currentPage
    }
    this.meta.next(meta)
    this.currentPage.next(meta.currentPage)
  }
  setBalanceMeta(res: any) {
    let balanceMeta = {
      pageSize: res.data.pagedModel.pageSize,
      totalItems: res.data.pagedModel.totalItems,
      totalPages: res.data.pagedModel.totalPages,
      totalUnSeen: res.data.pagedModel.totalUnSeen,
      currentPage: res.data.pagedModel.currentPage
    }
    this.balanceMeta.next(balanceMeta)
    this.currentPage.next(balanceMeta.currentPage)
  }

  filter() {
    this.page.next(1);
    this.hasChanged.next(true);
  }

  resetFilter() {
    this.search.next('');
    this.page.next(1);
    this.limit.next(15);
    this.currentPage.next(1);
    this.rated.next(null);
    this.isOverdue.next(null);
    this.dateFrom.next(null);
    this.dateTo.next(null);
    this.walletFrom.next(null);
    this.walletTo.next(null);
    this.orderKey.next(0);
    this.orderDirection.next(0);
    this.voteCanceled.next(null);
    this.assigneeState.next(null);
    this.type.next(null);
    this.meta.next(null);
    this.amountFrom.next(null);
    this.amountTo.next(null);
    this.transactionType.next(null);
    this.sessionStatus.next(null);
    this.role.next(null);
    this.attendanceType.next(null);
    this.taskStatus.next([]);
    this.taskType.next([]);
    this.priority.next([]);
    this.voteStatus.next([]);
    this.creators.next([]);
    this.assignees.next([]);
    this.department.next([]);
    this.rateValue.next([]);
    this.managers.next([]);
    this.project.next([]);
    this.month.next(null);
    this.levels.next([]);
    this.penaltyTypeId.next(null);
    this.year.next(null);
    this.userId.next(null);
    this.employeeId.next(null);
    this.selectedUser.next(null);
  }
}
