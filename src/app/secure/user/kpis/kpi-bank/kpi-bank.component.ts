import { HttpParams } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KpisService } from 'src/app/core/services/kpis.service';
import { KpiFormComponent } from './kpi-form/kpi-form.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { ConfirmationMessageComponent } from 'src/app/core/dialogs/confirmation-message.component';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { EvaluationFrequency } from 'src/app/core/enums/evaluation-frequency';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'kpi-bank',
  templateUrl: './kpi-bank.component.html',
  styleUrls: ['./kpi-bank.component.scss'],


})
export class KpiBankComponent {
  totalItems: any;
  limit: any = 15;
  page:any = 1
  selectedItem : any
  itemsList: any = [];
  loading: boolean = false;
  menu: any;
  isKpiAdmin = false
  isAdmin = false
  isCreator = false;
  loggedInUserId = localStorage.getItem('id');
  historyIsOpen = false;
  historyloading = false;
  enLanguage = localStorage.getItem('language') === 'en';
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  itemLogs: any[] = [];
  EvaluationFrequency = enumToArray(EvaluationFrequency);
  equation: string = '...';
  constructor(
    private service:KpisService,
    private role:RolesService,
    private dialog:MatDialog,
    private alert:AlertService,
    private translate: TranslateService 

  ) {}

  ngOnInit(){
    this.getKpiscategories()
    this.role.isKPIBankAdmin.subscribe((res:any) => {
      this.isKpiAdmin = res
    })
    this.role.canAccessAdmin.subscribe((res:any) => {
      this.isAdmin = res
    })
  }

  getKpiscategories(){
    this.loading = true
    this.itemsList = []
    let params = new HttpParams().set('page' , this.page).set('limit' , this.limit)
    this.service.getAllKpisCategory(params).subscribe((res:any) => {
      this.totalItems = res.data.totalItems
      res.data.items.forEach((item:any) => {
      });
      this.itemsList = res.data.items
      this.loading = false
    })
  }

  getKpis(category: any) {
    const params = new HttpParams().set('CategoryId', category.id);
    const categoryItem = this.itemsList.find((item: any) => item.id === category.id);
    if (!categoryItem) {
      return;
    }
    if (categoryItem.kpis.length === 0) {
      this.service.getAllKpisByCategoryId(params).subscribe({
        next: (res: any) => {
          categoryItem.kpis = res.data;
        },
        error: (err) => {
        }
      });
    }
  }

  createOrUpdate(kpi = false ,update = false , selected = {}){
    let ref = this.dialog.open(KpiFormComponent,{
      width:'600px',
      data:{
        kpi:kpi,
        update:update,
        item:selected
      }
    })
    ref.afterClosed().subscribe((res:any) => {
      if(res){
        this.getKpiscategories()
      }
    })
  }

  deleteItem(item:any , kpi = false) { // if kpi == false run category else run kpi
    const id = item.id
    let message :any
    if(!kpi && item.kpis.length == 0){
      message = 'delete_kpi_category_message'
    }else if(!kpi && item.kpis.length > 0){
      message = 'delete_kpi_category_message_with_kpis'
    } else{
      message = 'delete_kpi_message'
    }
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      autoFocus: false,
      data: {
        message: message,
        btn_name: 'delete',
        classes: 'bg-primary white',
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      if(response){
        if(!kpi){
          this.service.deleteKpisCategory(id).subscribe((res : any) => {
            if(res.success){
              this.alert.showAlert('category_deleted_successfully')
              this.getKpiscategories()
            }
          })
        }else{
          this.service.deleteKpi(id).subscribe((res : any) => {
            if(res.success){
              this.alert.showAlert('kpi_deleted_successfully')
              this.getKpiscategories()
            }
          })
        }
      }
    });


  }

  approve(id:any , kpi =false) { // if kpi == false run category else run kpi
    if(!kpi){
      this.service.approveKpisCategory(id).subscribe((res : any) => {
        if(res.success){
          this.alert.showAlert('category_approved_successfully')
          this.getKpiscategories()
        }
      })
    }else{
      this.service.approveKpis(id).subscribe((res : any) => {
        if(res.success){
          this.alert.showAlert('kpi_approved_successfully')
          this.getKpiscategories()
        }
      })
    }
  }

  showItem(item: any , kpi = false) { // if kpi == false run category else run kpi
    this.selectedItem = item
    this.selectedItem.kpi = kpi
    this.dialog.open(this.dialogTemplate , {
    width:'600px'
    })

  }

  pageChanged($event: number) {
    this.page = $event
    this.getKpiscategories()
  }
  changeLimit() {
    this.page = 1
    this.getKpiscategories()
  }

  getLogs(itemId: any , ref:any) {
    let  params = new HttpParams().set('ObjectId' , itemId).set('kpiHistoryRefrance' , ref)
    this.historyloading = true;
    this.historyIsOpen = false;
    this.service.getKpisHestory(params).subscribe((res: any) => {
      this.historyloading = false;
      this.historyIsOpen = true;
      this.itemLogs = res.data;
    });
  }

  getEquation(item:any){
    this.equation = '...'
    this.service.kpiValueTypeToolTip(item.valueTypeId).subscribe((res:any)=>{
      this.equation =  this.enLanguage ? String(res.equationEn) : String(res.equationAr)
    })
  }

}
