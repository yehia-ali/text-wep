import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  taskedinSuperAdmin = new BehaviorSubject<boolean>(false);
  canAccessAdmin = new BehaviorSubject<boolean>(false);
  isSuperAdmin = new BehaviorSubject<boolean>(false);
  isAdmin = new BehaviorSubject<boolean>(false);
  isManager = new BehaviorSubject<boolean>(false);
  isEmployeesKPI = new BehaviorSubject<boolean>(false);
  isKPIRater = new BehaviorSubject<boolean>(false);
  isKPIBankAdmin = new BehaviorSubject<boolean>(false);
  rolesLoaded$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {
  }

  getRoles() {
    return this.http.get(`${environment.apiUrl}api/ProfileRole/GetMyRolesPermissions`).pipe(map((res: any) => {

      let isAdmin = !!res.data?.SpaceAdmin || !!res.data?.Admin
      let isManager = !!res.data?.SpaceManager;
      let isSuperAdmin = !!res.data?.SpaceSuperAdmin;
      let isEmployeesKPI = !!res.data?.EmployeesKPI;
      let isKPIRater = !!res.data?.KPIRater;
      let isKPIBankAdmin = !!res.data?.KPIBankAdmin;

      if (isManager) {
        this.isManager.next(true)
      }
      if (isEmployeesKPI) {
        this.isEmployeesKPI.next(true)
      }
      if (isKPIRater) {
        this.isKPIRater.next(true)
      }
      if (isKPIBankAdmin) {
        this.isKPIBankAdmin.next(true)
      }
      if (isAdmin) {
        this.isAdmin.next(true);
      }
      if (isSuperAdmin) {
        this.isSuperAdmin.next(true);
      }
      if (isSuperAdmin || isAdmin) {
        this.canAccessAdmin.next(true)
      }
      this.rolesLoaded$.next(true)
      return res
    }));
  }

  isTaskedinSuperAdmin() {
    return this.http.get(`${environment.coreBase}/api/Authentication/isSuperAdmin`).pipe(map((res: any) => {
      let isSuperAdmin = res.data.isSuperAdmin;
      if (isSuperAdmin) {
        this.taskedinSuperAdmin.next(true);
        this.canAccessAdmin.next(true)
      }
      return isSuperAdmin;
    }))
  }


  getUserRoles(): string[] {
    const roles: string[] = [];

    if (this.isAdmin.value) {
      roles.push('admin');
    }

    if (this.isSuperAdmin.value) {
      roles.push('super-admin');
    }

    if (this.canAccessAdmin.value) {
      roles.push('can-access-admin');
    }

    if (this.isManager.value) {
      roles.push('manager');
    }
    if (this.isEmployeesKPI.value) {
      roles.push('kpi-employee');
    }
    if (this.isKPIRater.value) {
      roles.push('kpi-rater');
    }
    if (this.isKPIBankAdmin.value) {
      roles.push('kpi-admin');
    }

    if (this.taskedinSuperAdmin.value) {
      roles.push('taskedin-super-admin');
    }

    return roles;
  }
}
