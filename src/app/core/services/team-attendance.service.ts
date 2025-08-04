import {Injectable} from '@angular/core';
import {BehaviorSubject, map, shareReplay, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DatePipe, formatDate} from "@angular/common";
import {FiltersService} from "./filters.service";

@Injectable({
  providedIn: 'root'
})
export class TeamAttendanceService extends FiltersService {
  dashboard = new BehaviorSubject({});
  startDateFrom = new BehaviorSubject<any>(new Date());
  filterValue = new BehaviorSubject<any>(null)
  refresh: boolean = false;
  
  // Private cached observable for attendance data
  private _cachedAttendanceData$: Observable<any> | null = null;

  constructor(private http: HttpClient , private datePipe : DatePipe) {
    super()
    
    // Invalidate cache when date changes
    this.startDateFrom.subscribe(() => {
      this.invalidateCache();
    });
    
    // Invalidate cache when filter changes
    this.filterValue.subscribe(() => {
      this.invalidateCache();
    });
    
    // Invalidate cache when search changes
    this.search.subscribe(() => {
      this.invalidateCache();
    });
    
    // Invalidate cache when page changes
    this.page.subscribe(() => {
      this.invalidateCache();
    });
    
    // Invalidate cache when limit changes
    this.limit.subscribe(() => {
      this.invalidateCache();
    });
  }

  getUserAttendance() {
    let url = new URL(`${environment.apiUrl}api/Attendance/GetUsersAttendanceByManager?Day=${this.datePipe.transform(this.startDateFrom.value, 'yyyy-MM-dd') || ''}`);
    typeof this.filterValue.value == 'number' && url.searchParams.append('Filter', String(this.filterValue.value));
    this.params(url)
    return this.http.get(`${url}`).pipe(map(((res: any) => {
      this.setMeta(res);
      return res.data.items;
    })))
  }

  getDashboard() {
    let url = new URL(`${environment.apiUrl}api/Attendance/AttentanceManagerDashbord?startDate=${this.datePipe.transform(this.startDateFrom.value, 'yyyy-MM-dd') || ''}&endDate=${this.datePipe.transform(this.startDateFrom.value, 'yyyy-MM-dd') || ''}`)
    return this.http.get(`${url}`).pipe(map((res: any) => {
      this.dashboard.next(res.data);
      return res.data;
    }))
  }

  getUsersAttendanceByManagerCache() {
    // If refresh is requested or cache doesn't exist, create new observable
    if (this.refresh || !this._cachedAttendanceData$) {
      let url = new URL(`${environment.apiUrl}api/Attendance/GetUsersAttendanceByManagercache?Day=${this.datePipe.transform(this.startDateFrom.value, 'yyyy-MM-dd') || ''}`);
      typeof this.filterValue.value == 'number' && url.searchParams.append('Filter', String(this.filterValue.value));
      
      // Add refresh parameter if refresh is requested
      if (this.refresh) {
        url.searchParams.append('Recache', 'true');
      } else {
        url.searchParams.append('Recache', 'false');
      }
      
      this.params(url)
      this._cachedAttendanceData$ = this.http.get(`${url}`).pipe(
        map(((res: any) => {
          return res.data;
        })),
        shareReplay(1)
      );
      
      // Reset refresh flag after creating new cache
      this.refresh = false;
    }
    
    return this._cachedAttendanceData$!;
  }

  // Method to force refresh cache
  forceRefresh() {
    this.refresh = true;
    this._cachedAttendanceData$ = null; // Clear the cache
    this.hasChanged.next(true);
  }

  // Method to clear refresh flag
  clearRefreshFlag() {
    this.refresh = false;
  }

  // Method to check if data is cached
  isDataCached(): boolean {
    return !this.refresh;
  }

  // Method to get cached data without forcing refresh
  getCachedData() {
    this.refresh = false;
    this.hasChanged.next(true);
  }

  // Method to invalidate cache when filters change
  invalidateCache() {
    this._cachedAttendanceData$ = null;
    this.hasChanged.next(true);
  }
  getUsersAttendanceByManagerExcel() {
    let url = new URL(`${environment.apiUrl}api/Attendance/GetUsersAttendanceByManagerExcel?Day=${this.datePipe.transform(this.startDateFrom.value, 'yyyy-MM-dd') || ''}`);
    typeof this.filterValue.value == 'number' && url.searchParams.append('Filter', String(this.filterValue.value));
    this.params(url)
    return this.http.get(`${url}`, { 
      responseType: 'blob',
      observe: 'response'
    }).pipe(map((response: any) => {
      // Extract filename from content-disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'Attendance_Report.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Create blob URL for download
      const blob = new Blob([response.body], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      return {
        blob: blob,
        filename: filename
      };
    }))
  }
}
