import {Injectable} from '@angular/core';
import {BehaviorSubject, debounceTime, map, Subject, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BillingOrdersService {
  meta = new BehaviorSubject<any>({});
  orders = new BehaviorSubject([]);
  currentPage = new BehaviorSubject<any>(1);
  currentPageValue: any = 1;
  search = new Subject();
  searchValue: any = '';
  loading = new BehaviorSubject(true);

  creationDateFrom = new BehaviorSubject('');
  creationDateFromValue = '';
  creationDateTo = new BehaviorSubject('');
  creationDateToValue = '';
  expiredDateFrom = new BehaviorSubject('');
  expiredDateFromValue = '';
  expiredDateTo = new BehaviorSubject('');
  expiredDateToValue = '';
  startDateFrom = new BehaviorSubject('');
  startDateFromValue = '';
  startDateTo = new BehaviorSubject('');
  startDateToValue = '';

  userCountFrom = new BehaviorSubject('');
  userCountFromValue = '';
  userCountTo = new BehaviorSubject('');
  userCountToValue = '';
  costFrom = new BehaviorSubject('');
  costFromValue = '';
  costTo = new BehaviorSubject('');
  costToValue = '';
  paymentStatus = new BehaviorSubject(null);
  paymentStatusValue = null;
  packages = new BehaviorSubject<any>([]);
  packagesValue: any = [];
  limit = new BehaviorSubject(15);
  limitValue = 15;

  sort = new BehaviorSubject(null);
  sortValue = null;

  sortDirection = new BehaviorSubject(null);
  sortDirectionValue = null;


  constructor(private http: HttpClient) {
    this.currentPage.subscribe(res => this.currentPageValue = res);
    this.search.subscribe(res => this.searchValue = res)
    this.limit.subscribe(res => this.limitValue = res)
    this.creationDateFrom.subscribe(res => this.creationDateFromValue = res)
    this.creationDateTo.subscribe(res => this.creationDateToValue = res)
    this.expiredDateFrom.subscribe(res => this.expiredDateFromValue = res)
    this.expiredDateTo.subscribe(res => this.expiredDateToValue = res)
    this.startDateFrom.subscribe(res => this.startDateFromValue = res)
    this.startDateTo.subscribe(res => this.startDateToValue = res)
    this.userCountFrom.subscribe(res => this.userCountFromValue = res)
    this.userCountTo.subscribe(res => this.userCountToValue = res)
    this.costFrom.subscribe(res => this.costFromValue = res)
    this.costTo.subscribe(res => this.costToValue = res)
    this.paymentStatus.subscribe(res => this.paymentStatusValue = res)
    this.packages.subscribe(res => this.packagesValue = res);
    this.sort.subscribe(res => this.sortValue = res);
    this.sortDirection.subscribe(res => this.sortDirectionValue = res);
    this.search.pipe(debounceTime(700), switchMap(() => this.getBillingOrders())).subscribe()
  }

  getBillingOrders() {
    this.loading.next(true);
    let url: any = new URL(`${environment.apiUrl}api/PaymentOrder/GetBillingOrders`)
    url.searchParams.append('limit', JSON.stringify(this.limitValue));
    url.searchParams.append('page', this.currentPageValue);
    this.creationDateFromValue && url.searchParams.append('CreationDateFrom', this.creationDateFromValue)
    this.creationDateToValue && url.searchParams.append('CreationDateTo', this.creationDateToValue)
    this.expiredDateFromValue && url.searchParams.append('ExpiredDateFrom', this.expiredDateFromValue)
    this.expiredDateToValue && url.searchParams.append('ExpiredDateTo', this.expiredDateToValue)
    this.startDateFromValue && url.searchParams.append('StartDateFrom', this.startDateFromValue)
    this.startDateToValue && url.searchParams.append('StartDateTo', this.startDateToValue)
    this.userCountFromValue && url.searchParams.append('UserCountFrom', this.userCountFromValue)
    this.userCountToValue && url.searchParams.append('UserCountTo', this.userCountToValue)
    this.costFromValue && url.searchParams.append('CostFrom', this.costFromValue)
    this.costToValue && url.searchParams.append('CostTo', this.costToValue)
    if (this.sortValue) {
      url.searchParams.append('orderKey', this.sortValue)
      url.searchParams.append('orderDirection', this.sortDirectionValue)
    }

    this.packagesValue.length > 0 && this.packagesValue.map((item: any) => {
      url.searchParams.append('packageId', item.id)
    });
    if (this.paymentStatusValue == 0 || this.paymentStatusValue == 1) {
      url.searchParams.append('PaymentStatus', this.paymentStatusValue)
    }

    this.searchValue && url.searchParams.append('search', this.searchValue);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      let orders = res.data.items;
      let meta = {
        pageSize: res.data.pageSize,
        totalItems: res.data.totalItems,
        totalPages: res.data.totalPages,
        totalUnSeen: res.data.totalUnSeen,
        currentPage: res.data.currentPage
      }
      this.loading.next(false);
      this.meta.next(meta)
      this.currentPage.next(meta.currentPage)
      this.orders.next(orders);
      return orders
    }));
  }

}
