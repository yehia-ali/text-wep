import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HrEmployeesService {
  url = environment.apiUrl + 'api/';
  filesType = new BehaviorSubject<any>([]);
  users = new BehaviorSubject<any>([]);
  constructor(private http: HttpClient) {}
  // files
  getFilesType() {
    return this.http.get(`${this.url}FileSystem/GetFileTypes`);
  }
  getUserFiles(id: any) {
    return this.http.get(
      `${this.url}FileSystem/GetEmployeeFiles?EmployeeId=${id}`
    );
  }
  getUsers(params : HttpParams) {
    return this.http.get(`${this.url}Space/GetSpaceUserProfiles`, { params });
  }

  updateUserProfile(data:any) {
    return this.http.put(`${this.url}UserProfile/UpdateUserProfile` , data);
  }

  getAllPersonalInformation() {
    return this.http.get(`${this.url}PersonalInformation/GetAllPersonalInformation`);
  }

  getUserProfile(id: any) {
    return this.http.get(`${this.url}UserProfile/GetUserProfile?id=${id}`);
  }

  createFileType(data: any) {
    return this.http.post(`${this.url}FileSystem/CreateFileType`, data);
  }
  createFile(data: any) {
    return this.http.post(`${this.url}FileSystem/CreateFile`, data);
  }
  // files
  // personal information

  getAllGenders() {
    return this.http.get(`${this.url}PersonalInformation/GetAllGenders`);
  }
  getAllRegions(params: HttpParams) {
    return this.http.get(`${this.url}PersonalInformation/GetAllRegions`, {
      params,
    });
  }
  getAllReligons() {
    return this.http.get(`${this.url}PersonalInformation/GetAllReligons`);
  }
  getAllCountry() {
    return this.http.get(`${this.url}Country/GetAll`);
  }
  createUserPresonalInfo(data: any) {
    return this.http.post(
      `${this.url}PersonalInformation/CreatePersonalInformation`,
      data
    );
  }
  updateUserpresonalInfo(data: any) {
    return this.http.put(
      `${this.url}PersonalInformation/UpdatePersonalInformation`,
      data
    );
  }
  getUserpresonalInfo(id: any) {
    return this.http.get(
      `${this.url}PersonalInformation/GetPersonalInformationByEmployeeId?EmployeeId=${id}`
    );
  }
  // personal information

  // Work Info
  createWorkInfo(data: any) {
    return this.http.post(`${this.url}WorkInfo/CreateWorkInfo`, data);
  }

  updateWorkInfo(data: any) {
    return this.http.put(`${this.url}WorkInfo/UpdateWorkInfo`, data);
  }
  deleteWorkInfo(id: any) {
    return this.http.delete(`${this.url}WorkInfo/DeleteWorkInfo?id=${id}`);
  }
  getAllWorkInfo(params: any) {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] != null) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get(`${this.url}WorkInfo/GetAllWorkInfos`, {
      params: httpParams,
    });
  }
  getUserWorkInfo(params: any) {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] != null) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return this.http.get(`${this.url}WorkInfo/GetAllWorkInfosByUserId`, {
      params: httpParams,
    });
  }
  getWorkInfo(id: any) {
    return this.http.get(`${this.url}WorkInfo/GetWorkInfoById?id=${id}`);
  }
  // Work Info
  //WorkExp/GetAllWorkExps
  createWorkExp(data: any) {
    return this.http.post(`${this.url}WorkExp/CreateWorkExp`, data);
  }
  updateWorkExp(data: any) {
    return this.http.put(`${this.url}WorkExp/UpdateWorkExp`, data);
  }
  deleteWorkExp(id: any) {
    return this.http.delete(`${this.url}WorkExp/DeleteWorkExp?id=${id}`);
  }
  getAllWorkExp() {
    return this.http.get(`${this.url}WorkExp/GetAllWorkExps`);
  }

  getWorkExp(id: any) {
    return this.http.get(`${this.url}WorkExp/GetAllWorkExps?id=${id}`);
  }
  // WorkExp/GetAllWorkExps
  //JobTitle/GetAllJobTitles
  createJobTitle(data: any) {
    return this.http.post(`${this.url}JobTitle/CreateJobTitle`, data);
  }

  getAllJobTitles(params?: HttpParams) {
    return this.http.get(`${this.url}JobTitle/GetAllJobTitles`, {
      params,
    });
  }

  addUserToJop(params: HttpParams) {
    return this.http.post(`${this.url}JobTitle/AddUserToJob`,'', {params});
  }

  updateJobTitle(data: any) {
    return this.http.put(`${this.url}JobTitle/UpdateJobTitle`, data);
  }
  deleteJobTitle(id: any) {
    return this.http.delete(`${this.url}JobTitle/DeleteJobTitle?id=${id}`);
  }

  getJobTitle(id: any) {
    return this.http.get(`${this.url}JobTitle/GetAllJobTitles?id=${id}`);
  }
  // WorkType/GetAllWorkTypes
  //WorkType/GetAllWorkTypes
  createWorkType(data: any) {
    return this.http.post(`${this.url}WorkType/CreateWorkType`, data);
  }
  updateWorkType(data: any) {
    return this.http.put(`${this.url}WorkType/UpdateWorkType`, data);
  }
  deleteWorkType(id: any) {
    return this.http.delete(`${this.url}WorkType/DeleteWorkType?id=${id}`);
  }
  getAllWorkType() {
    return this.http.get(`${this.url}WorkType/GetAllWorkTypes`);
  }

  getWorkType(id: any) {
    return this.http.get(`${this.url}WorkType/GetAllWorkTypes?id=${id}`);
  }
  // WorkType/GetAllWorkTypes

  //Banks - Accounts
  createBank(data: any) {
    return this.http.post(`${this.url}Bank/AddBank`, data);
  }

  createBankBranch(data: any) {
    return this.http.post(`${this.url}Bank/AddBranch`, data);
  }

  createBankAccount(data: any) {
    return this.http.post(`${this.url}Bank/AddBankAccount`, data);
  }

  deleteBank(id: any) {
    return this.http.delete(`${this.url}Bank/DeleteBank?BankId=${id}`);
  }

  deleteBankBranch(id: any) {
    return this.http.delete(`${this.url}Bank/DeleteBranch?BankBranchId=${id}`);
  }

  deleteBankAccount(id: any) {
    return this.http.delete(
      `${this.url}Bank/DeleteBankAccount?AccountId=${id}`
    );
  }

  getAllBanks() {
    return this.http.get(`${this.url}Bank/GetAllBanks`);
  }

  getAllBankBranches(bankId: any) {
    return this.http.get(`${this.url}Bank/GetAllBankBranches?BankId=${bankId}`);
  }

  getAllBankAccounts(params: HttpParams) {
    return this.http.get(`${this.url}Bank/GetAllBankAccounts`, { params });
  }

  getBankAccount(params: HttpParams) {
    return this.http.get(`${this.url}Bank/GetBankAccount`, { params });
  }

  // Banks - Accounts
  // Contracts
  getUserContracts(params: any) {
    return this.http.get(`${environment.apiUrl}api/Contract/GetUserContracts`, {
      params,
    });
  }
  changeContractStatus(params: any) {
    return this.http.get(`${environment.apiUrl}api/Contract/ChangeContractStatus`, {
      params,
    });
  }
  // Contracts
  // Leaves
  getUserLeaveTypes(employeeId?: any) {
    return this.http.get(
      `${environment.apiUrl}api/Leave/GetUserLeaveTypes?EmployeeId=${employeeId}`
    );
  }
  // Leaves
  // Penalties
  getAllPenalties(employeeId?: any) {
    return this.http.get(
      `${environment.apiUrl}api/Penalty/GetDeductions?employeeId=${employeeId}`
    );
  }
  getAllPenaltiesType() {
    return this.http.get(`${environment.apiUrl}api/Penalty/GetAllPenaltyTypes`);
  }
  addPenalty(params:HttpParams) {
    return this.http.post(`${environment.apiUrl}api/Penalty/ApplyPenalty`, '',{params});
  }
  updatePenaltyType(data:any) {
    return this.http.put(`${environment.apiUrl}api/Penalty/UpdatePenaltyType/${data.id}`, data);
  }
  addPenaltyType(data:any) {
    return this.http.post(`${environment.apiUrl}api/Penalty/CreatePenaltyType`, data);
  }
  // Penalties

  // Shifts
  getShifts(params: HttpParams) {
    return this.http.get(`${environment.apiUrl}api/Shifts/GetShifts`, {
      params,
    });
  }
  getUserShifts(userId: any) {
    return this.http.get(
      `${environment.apiUrl}api/Shifts/GetUserShifts?UserId=${userId}`
    );
  }
  createShiftDay(data: any) {
    return this.http.post(`${environment.apiUrl}api/Shifts/AddShiftDay`, data);
  }
  updateShiftDay(data: any) {
    return this.http.post(`${environment.apiUrl}api/Shifts/AddShiftDay`, data);
  }

  getEmployeeDays(EmployeeId: any) {
    return this.http
      .get(
        `${environment.apiUrl}api/Shifts/GetEmployeeDays?EmployeeId=${EmployeeId}`
      )
      .pipe(
        map((response: any) => {
          const daysArray = response.data || []; // Access the correct data array
          const weekDays = [
            { day: 'sunday', weekDay: 0 },
            { day: 'monday', weekDay: 1 },
            { day: 'tuesday', weekDay: 2 },
            { day: 'wednesday', weekDay: 3 },
            { day: 'thursday', weekDay: 4 },
            { day: 'friday', weekDay: 5 },
            { day: 'saturday', weekDay: 6 },
          ];

          const result = weekDays.map((dayObj) => {
            const found = daysArray.find(
              (item: any) => item.weekDay === dayObj.weekDay
            );

            if (found) {
              return {
                ...found,
                dayName: dayObj.day,
                isDayAdded: true,
              };
            } else {
              return {
                weekDay: dayObj.weekDay,
                dayName: dayObj.day,
                checkInTime: null,
                checkOutTime: null,
                checkInAllowance: 0,
                checkOutAllowance: 0,
                preventChackin: null,
                long: null,
                lat: null,
                raduis: null,
                workingHours: null,
                earlyCheckIn: null,
                shiftId: null,
                isWeekEnd: null,
                isDayAdded: false,
              };
            }
          });

          return result;
        })
      );
  }
  getShiftDays(ShiftId: any) {
    return this.http
      .get(`${environment.apiUrl}api/Shifts/GetShiftDays?ShiftId=${ShiftId}`)
      .pipe(
        map((response: any) => {
          const daysArray = response.data || []; // Access the correct data array
          const weekDays = [
            { day: 'sunday', weekDay: 0 },
            { day: 'monday', weekDay: 1 },
            { day: 'tuesday', weekDay: 2 },
            { day: 'wednesday', weekDay: 3 },
            { day: 'thursday', weekDay: 4 },
            { day: 'friday', weekDay: 5 },
            { day: 'saturday', weekDay: 6 },
          ];

          const result = weekDays.map((dayObj) => {
            const found = daysArray.find(
              (item: any) => item.weekDay === dayObj.weekDay
            );

            if (found) {
              return {
                ...found,
                dayName: dayObj.day,
                isDayAdded: true,
              };
            } else {
              return {
                weekDay: dayObj.weekDay,
                dayName: dayObj.day,
                checkInTime: null,
                checkOutTime: null,
                checkInAllowance: 0,
                checkOutAllowance: 0,
                preventChackin: null,
                long: null,
                lat: null,
                raduis: null,
                workingHours: null,
                earlyCheckIn: null,
                shiftId: null,
                isWeekEnd: null,
                isDayAdded: false,
              };
            }
          });

          return result;
        })
      );
  }
  addUserToShift(data: any) {
    return this.http.post(
      `${environment.apiUrl}api/Shifts/AddUsersToShift`,
      data
    );
  }
  //s Shifts
  // Salary Effects/  => GET ​//api/SalaryAffect/GetAllSalaryAffectTypes
  createSalaryAffect(data: any) {
    return this.http.post(`${this.url}SalaryAffect/CreateSalaryAffect`, data);
  }
  createSalaryAffectType(data: any) {
    return this.http.post(
      `${this.url}SalaryAffect/CreateSalaryAffectType`,
      data
    );
  }
  updateSalaryAffect(data: any) {
    return this.http.put(`${this.url}SalaryAffect/UpdateSalaryAffect`, data);
  }
  updateSalaryAffectType(data: any) {
    return this.http.put(
      `${this.url}SalaryAffect/UpdateSalaryAffectType`,
      data
    );
  }

  deleteSalaryAffect(id: any) {
    return this.http.delete(
      `${this.url}SalaryAffect/DeleteSalaryAffect?id=${id}`
    );
  }

  deleteSalaryAffectType(id: any) {
    return this.http.delete(
      `${this.url}SalaryAffect/DeleteSalaryAffectType?id=${id}`
    );
  }

  getAllSalaryAffects(params: HttpParams) {
    return this.http.get(`${this.url}SalaryAffect/GetAllSalaryAffects`, {
      params,
    });
  }
  getAllSalaryAffectsEmployee(params: HttpParams) {
    return this.http.get(
      `${this.url}SalaryAffect/GetAllSalaryAffectsForEmployee`,
      { params }
    );
  }
  getAllSalaryAffectsTypes(params: any) {
    return this.http.get(`${this.url}SalaryAffect/GetAllSalaryAffectTypes`, {
      params,
    });
  }

  getSalaryAffectAccount(params: HttpParams) {
    return this.http.get(`${this.url}SalaryAffect/GetSalaryAffectAccount`, {
      params,
    });
  }

  // Salary Effects
  // Contracts
  getActiveContract(params: HttpParams) { //add EmployeeId to params
    return this.http.get(`${this.url}Contract/GetActiveContract`, {
      params,
    });
  }
  // Contracts
  // inshurance
  getUserInshurance(employeeId:any) {
    return this.http.get(`${this.url}InsuranceInfo/GetByEmployee/${employeeId}`)
  }
  createUserInshurance(data:any) {
    return this.http.post(`${this.url}InsuranceInfo/Create` , data)
  }
  // inshurance
// departments
getDepartments(params?:any) {
  return this.http
    .get(`${environment.apiUrl}api/Department/GetSpaceDepartements` , {params}).pipe(map((res: any) => {
      let departments = res.data;
      return departments;
    }));
}
updateDepartment(data:any) {
  return this.http.put(`${environment.apiUrl}api/Department/update` , data)
}
createDepartment(data:any) {
  return this.http.post(`${environment.apiUrl}api/Department/create` , data)
}
// departments
// places

createPlace(data:any) {
  return this.http.post(`${environment.apiUrl}api/Place/InsertPlace` , data)
}

updatePlace(data:any) {
  return this.http.put(`${environment.apiUrl}api/Place/UpdatePlace` , data)
}

deletePlace(id:any) {
  return this.http.delete(`${environment.apiUrl}api/Place/DeletePlace?id=${id}`)
}

addUserToPlace(data:any) {
  return this.http.post(`${environment.apiUrl}api/Place/AddUserToPlace` , data)
}

getAllPlaces(params?:HttpParams) {
  return this.http.get(`${environment.apiUrl}api/Place/GetAllPlaces` , {params}).pipe(map((res:any) => {
    return res.data
  }))
}

getPlace(id:any) {
  return this.http.get(`${environment.apiUrl}api/Place/GetPlaceById?id=${id}`).pipe(map((res:any) => {
    return res.data
  }))
}
// places
// Levels

createLevel(data:any) {
  return this.http.post(`${environment.apiUrl}api/Level/InsertLevel` , data)
}

updateLevel(data:any) {
  return this.http.put(`${environment.apiUrl}api/Level/UpdateLevel` , data)
}

deleteLevel(id:any) {
  return this.http.delete(`${environment.apiUrl}api/Level/DeleteLevel?id=${id}`)
}

addUserToLevel(data:any) {
  return this.http.post(`${environment.apiUrl}api/Level/AddUserToLevel` , data)
}

getAllLevels(params?:HttpParams) {
  return this.http.get(`${environment.apiUrl}api/Level/GetAllLevels` , {params}).pipe(map((res:any) => {
    return res.data
  }))
}

getLevel(id:any) {
  return this.http.get(`${environment.apiUrl}api/Place/GetPlaceById?id=${id}`).pipe(map((res:any) => {
    return res.data
  }))
}
// Levels
// user KPIS
setUserKpi(data:any) {
  return this.http.post(`${environment.apiUrl}api/KPIUser/SetKPIsToUser` , data)
}

removeUserKpi(UserId:any) {
  return this.http.delete(`${environment.apiUrl}api/KPIUser/RemoveKPIsFromUser?UserId=${UserId}`)
}

getUserKpi(UserId:any) {
  return this.http.get(`${environment.apiUrl}api/KPIUser/GetUserKPIs?UserId=${UserId}`).pipe(map((res:any) => {
    return res
  }))
}
getKpiUsers(kpiId:any) {
  return this.http.get(`${environment.apiUrl}api/KPIUser/GetKpiUsers?KpiId=${kpiId}`).pipe(map((res:any) => {
    return res
  }))
}

createOrUpdateKpi(data:any) {
  return this.http.post(`${environment.apiUrl}api/KPIValues/edit` , data)
}

getSpaceKpis() {
  return this.http.get(`${environment.apiUrl}api/KPIValues/GetBySpaceId`).pipe(map((res:any) => {
    return res.data
  }))
}
getKpisList() {
  return this.http.get(`${environment.apiUrl}api/KPIValues/GetKpisList`).pipe(map((res:any) => {
    return res
  }))
}
// user KPIS
getPayrollCycle() {
  return this.http.get(`${this.url}SpaceConfigration/Get`);
}

updatePayrollCycle(data: any) {
  return this.http.post(`${this.url}Space/ConfigureSpace`, data);
}
// Latency Policy
getAllLatencyPolicies() {
  return this.http.get(`${this.url}LatencyPolicy/GetAllLatencyPolicies`)
}
addLatencyPolicy(data:any) {
  return this.http.post(`${this.url}LatencyPolicy/AddLatencyPolicy` , data)
}
editLatencyPolicy(data:any) {
  return this.http.put(`${this.url}LatencyPolicy/UpdateLatencyPolicy`, data)
}
deleteLatencyPolicy(id:any) {
  return this.http.delete(`${this.url}LatencyPolicy/DeleteLatencyPolicy?latencyPolicyId=${id}`)
} 
getLatencyPolicy(id:any) {
  return this.http.get(`${this.url}LatencyPolicy/GetLatencyPolicy?latencyPolicyId=${id}`)
}

downloadBulkUsersTemplate() {
  return this.http.get(`${this.url}Authentication/DownloadBulkUsersTemplate` , {responseType: 'blob'})
}
uploadBulkEmployees(data:any) {
  return this.http.post(`${this.url}UserProfile/UploadBulkEmployees` , data)
}
}
