import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, map, Subject, switchMap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SpacesService {
  meta = new BehaviorSubject<any>({});
  spaces = new BehaviorSubject([]);
  currentPage = new BehaviorSubject<any>(1);
  currentPageValue: any = 1;
  search = new Subject();
  searchValue: any = '';
  loading = new BehaviorSubject(true);

  creationDateFrom = new BehaviorSubject('');
  creationDateFromValue = '';
  expiredDateFrom = new BehaviorSubject('');
  expiredDateFromValue = '';
  creationDateTo = new BehaviorSubject('');
  creationDateToValue = '';
  expiredDateTo = new BehaviorSubject('');
  expiredDateToValue = '';
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
  countries = new BehaviorSubject<any>(null);
  countriesValue: any = [];
  limit = new BehaviorSubject(15);
  limitValue = 15;
  sort = new BehaviorSubject(null);
  sortValue = null;

  sortDirection = new BehaviorSubject(null);
  sortDirectionValue = null;


  constructor(private http: HttpClient) {
    this.search.subscribe(res => this.searchValue = res)
    this.limit.subscribe(res => this.limitValue = res)
    this.creationDateFrom.subscribe(res => this.creationDateFromValue = res)
    this.currentPage.subscribe(res => this.currentPageValue = res);
    this.creationDateTo.subscribe(res => this.creationDateToValue = res)
    this.expiredDateFrom.subscribe(res => this.expiredDateFromValue = res)
    this.expiredDateTo.subscribe(res => this.expiredDateToValue = res)
    this.userCountTo.subscribe(res => this.userCountToValue = res)
    this.userCountFrom.subscribe(res => this.userCountFromValue = res)
    this.costTo.subscribe(res => this.costToValue = res)
    this.paymentStatus.subscribe(res => this.paymentStatusValue = res)
    this.costFrom.subscribe(res => this.costFromValue = res)
    this.packages.subscribe(res => this.packagesValue = res)
    this.countries.subscribe(res => this.countriesValue = res)
    this.sort.subscribe(res => this.sortValue = res);
    this.sortDirection.subscribe(res => this.sortDirectionValue = res);
    this.search.pipe(debounceTime(700), switchMap(() => this.getAllSpaces())).subscribe()
  }

  getAllSpaces() {
    this.loading.next(true);
    let url: any = new URL(`${environment.apiUrl}api/TenantSpace/getSpaces`)
    url.searchParams.append('page', this.currentPageValue);
    this.creationDateFromValue && url.searchParams.append('CreationDateFrom', this.creationDateFromValue)
    url.searchParams.append('limit', JSON.stringify(this.limitValue));
    this.creationDateToValue && url.searchParams.append('CreationDateTo', this.creationDateToValue)
    this.expiredDateFromValue && url.searchParams.append('ExpiredDateFrom', this.expiredDateFromValue)
    this.expiredDateToValue && url.searchParams.append('ExpiredDateTo', this.expiredDateToValue)
    this.userCountToValue && url.searchParams.append('UserCountTo', this.userCountToValue)
    this.userCountFromValue && url.searchParams.append('UserCountFrom', this.userCountFromValue)
    this.costFromValue && url.searchParams.append('CostFrom', this.costFromValue)
    this.costToValue && url.searchParams.append('CostTo', this.costToValue)
    if (this.countriesValue?.id || this.countriesValue?.id == 0) {
      url.searchParams.append('CountryID', this.countriesValue.id)
    }
    this.packagesValue.length > 0 && this.packagesValue.map((item: any) => {
      url.searchParams.append('packageId', item.id)
    });
    if (this.paymentStatusValue == 0 || this.paymentStatusValue == 1) {
      url.searchParams.append('PaymentStatus', this.paymentStatusValue)
    }
    if (this.sortValue) {
      url.searchParams.append('orderKey', this.sortValue)
      url.searchParams.append('orderDirection', this.sortDirectionValue)
    }

    this.searchValue && url.searchParams.append('search', this.searchValue);
    return this.http.get(`${url}`).pipe(map((res: any) => {
      let spaces = res.data.items;
      this.loading.next(false);
      let meta = {
        pageSize: res.data.pageSize,
        totalItems: res.data.totalItems,
        totalPages: res.data.totalPages,
        totalUnSeen: res.data.totalUnSeen,
        currentPage: res.data.currentPage
      }
      this.meta.next(meta)
      this.currentPage.next(meta.currentPage)
      this.spaces.next(spaces);
      return spaces
    }));
  }

  getAllSpacesLight(params?:HttpParams) {
    this.loading.next(true);

    return this.http.get(`${environment.apiUrl}api/Space/Spaces` , {params})
  }

  activeOrDeactiveSpace(data: any) {
    return this.http.put(`${environment.apiUrl}api/TenantSpace/MainDeactivateOrActivateSpace`, data)
  }

  activeOrDeactiveMultiSpace(data: any) {
    return this.http.put(`${environment.apiUrl}api/TenantSpace/MainDeactivateOrActivateMultiSpace`, data)
  }
  createLog(data: any) {
    return this.http.post(`${environment.apiUrl}api/PersonalInformation/AddClientLog`, data)
  }
  getLogs(spaceId: any) {
    return this.http.get(`${environment.apiUrl}api/PersonalInformation/GetClientLog?spaceId=${spaceId}`)
  }
  deleteLog(id: any) {
    return this.http.get(`${environment.apiUrl}api/PersonalInformation/DeleteClientLog?id=${id}`)
  }


}
