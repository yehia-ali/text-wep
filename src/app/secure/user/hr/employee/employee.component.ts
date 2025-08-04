import { Component } from '@angular/core';
import { LayoutComponent } from "../../../../core/components/layout.component";
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { WorkInfoComponent } from "./work-info/work.component";
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { InsuranceComponent } from "./insurance/insurance.component";
import { ContractsComponent } from "./contracts/contracts.component";
import { BankAccountsComponent } from "./bank-accounts/bank-accounts.component";
import { LeavesComponent } from "./leaves/leaves.component";
import { FilesComponentComponent } from "./files/files.component";
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { ActivatedRoute } from '@angular/router';
import { UserWithImageComponent } from "../../../../core/components/user-with-image/user-with-image.component";
import { CommonModule } from '@angular/common';
import { PenaltiesComponent } from "./penalties/penalties.component";
import { RewardsComponent } from "./rewards/rewards.component";
import { KpisComponent } from "./kpis/kpis.component";

@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  standalone:true,
  styleUrls: ['./employee.component.scss'],
  imports: [
    LayoutComponent,
    MatTabsModule,
    TranslateModule,
    BasicInfoComponent,
    WorkInfoComponent,
    PersonalInfoComponent,
    InsuranceComponent,
    ContractsComponent,
    BankAccountsComponent,
    LeavesComponent,
    FilesComponentComponent,
    UserWithImageComponent,
    CommonModule,
    PenaltiesComponent,
    RewardsComponent,
    KpisComponent
]
})
export class EmployeeComponent {
  activeTab  = 0;

  userId:any
  userData:any
  constructor(private service:HrEmployeesService , private route :ActivatedRoute ){
    this.route.params.subscribe((res:any) => {
      this.userId = res.id
    })
  }
  ngOnInit(){
    if(this.userId){
      this.getUserProfile();
    }

  }

  getUserProfile(){
    this.service.getUserProfile(this.userId).subscribe((res:any) => {
      this.userData = res.data;
      let UserData = {
        name:this.userData.name,
        id:this.userData.id,
      }
      localStorage.setItem('selectedUser' , JSON.stringify(UserData))
    })
  }

  onTabChange(event: any) {
    this.activeTab = event.index;
  }

}
