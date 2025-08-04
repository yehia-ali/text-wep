import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsCurrentSpaceService {
  currentSpace: any;

  constructor(private http: HttpClient) {}

  // Method to get the current space
  getMySpaces() {
    return this.http.get<any>(`${environment.coreBase}/api/TenantSpace/GetMySpaces`).pipe(
      map(res => {
        this.currentSpace = res.data.items.find((space: any) => space.isCurrent === true);
        return this.currentSpace;
      })
    );
  }

  // Optional method to get the current space if needed
  getCurrentSpace(): any {
    return this.currentSpace;
  }
}
