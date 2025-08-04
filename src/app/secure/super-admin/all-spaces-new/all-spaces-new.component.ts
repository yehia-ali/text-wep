import {Component, ElementRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {LayoutWithFiltersComponent} from "../../../core/components/layout-with-filters.component";
import * as XLSX from "xlsx";
import {ConfirmationMessageComponent} from "../../../core/dialogs/confirmation-message.component";
import {MatDialog} from "@angular/material/dialog";
import {SpacesService} from "../../../core/services/super-admin/spaces.service";
import {SortingComponent} from "../../../core/filters/sorting.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {ArabicDatePipe} from "../../../core/pipes/arabic-date.pipe";
import {MatChipsModule} from "@angular/material/chips";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NotFoundComponent} from "../../../core/components/not-found.component";
import {LoadingComponent} from "../../../core/components/loading.component";
import {LayoutService} from "../../../core/services/layout.service";
import {AlertService} from "../../../core/services/alert.service";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {ConfigureSpaceComponent} from "../../../core/components/configure-space/configure-space.component";
import {SpacesComponent} from "../../../core/filters/super-admin/spaces/spaces.component";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ClientLogsComponent } from '../client-logs/client-logs.component';
import { ClientLogsGetComponent } from '../client-logs-get/client-logs-get.component';
import { HttpParams } from '@angular/common/http';
import { LayoutComponent } from "../../../core/components/layout.component";
import { ArabicNumbersPipe } from "../../../core/pipes/arabic-numbers.pipe";
import { FormsModule } from '@angular/forms';
import { SearchComponent } from "../../../core/filters/search.component";

@Component({
  selector: 'all-spaces-new',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, CommonModule, UserNavbarComponent, TranslateModule, NgxPaginationModule, MatChipsModule, MatTooltipModule, NotFoundComponent, LoadingComponent, MatSlideToggleModule, LayoutComponent, ArabicNumbersPipe, SearchComponent],
  templateUrl: './all-spaces-new.component.html',
  styleUrls: ['./all-spaces-new.component.scss']
})
export class AllSpacesNewComponent implements OnInit {

  selectedSpaces: any[] = [];
  meta: any
  spaces: any[] = [];
  loading = false;
  dir = document.dir;
  timeout: any;
  layout = inject(LayoutService);
  alert = inject(AlertService);
  page= 1
  limit= 15
  searchValue: any;

totalItems: any;

  constructor(public service: SpacesService, private dialog: MatDialog, private elm: ElementRef) {
    this.getSpaces()
  }

  ngOnInit(): void {
    this.layout.withSubMenu.next(false);
  }

  getSpaces() {
    this.loading = true
    let params = new HttpParams().set('page', this.page).set('limit' , this.limit )
    if(this.searchValue){
      params = params.set('search', this.searchValue)
    }
    this.service.getAllSpacesLight(params).subscribe((res:any) =>{
      this.loading = false
      this.spaces = res.data.items
      this.page =res.data.currentPage
      this.limit =res.data.pageSize
      this.totalItems =res.data.totalItems
      console.log(res);
    })
  }

  pageChanged($event: number) {
    this.page = $event
    this.getSpaces()
  }
  changeLimit() {
    this.getSpaces()
  }

  search($event: any) {
    this.searchValue = $event;
    this.getSpaces()
  }

  toggleSpace(event: any, id: number, space: any) {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'small-dialog',
      data: {
        btn_name: "confirm",
        classes: 'bg-primary white',
        message: space.isActive ? "deactivate_space" : "activate_space"
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const data = {
          id,
          isActivated: !space.isActive
        }
        this.service.activeOrDeactiveSpace(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('space_status_changed');
            this.service.getAllSpacesLight().subscribe()
          }
        })
      }
    })
  }

  createLog(space:any, type = '') {
    const dialogRef = this.dialog.open(ClientLogsComponent, {
      panelClass: 'small-dialog',
      width:'600px',
      data: {
        btn_name: "confirm",
        type: type,
        space:space
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.alert.showAlert('space_status_changed');
      }
    })
  }
  showLogs(id:any) {
    const dialogRef = this.dialog.open(ClientLogsGetComponent, {
      panelClass: 'small-dialog',
      width:'800px',
      data: {
        btn_name: "confirm",
        space:id
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.alert.showAlert('space_status_changed');
      }
    })
  }
  goToSpace(space: any) {
    localStorage.setItem('space-id', JSON.stringify(space.id));
    localStorage.setItem('space-name', space.spaceName);

    localStorage.setItem("base-url", space.baseUrl);
    window.location.href = '/tasks/all-tasks';
  }

  spaceConfiguration(space: any) {
    this.dialog.open(ConfigureSpaceComponent, {
      panelClass: 'configure-space-dialog',
      data: {
        space
      }
    })
  }



  changePage($event: any) {
    this.service.currentPage.next($event);
    this.getSpaces()
  }

  limitChanged(e: any) {
    this.service.currentPage.next(1);
    this.service.limit.next(e);
    this.getSpaces();
  }

  exportToExcel() {
    /* pass here the table id */
    let element = this.elm.nativeElement.querySelector('#spaces-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'spaces.xlsx');
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  changeMultiSpacesStatus(isActivated:any){
    let data = {
      id:this.selectedSpaces,
      isActivated: isActivated
    }
    this.service.activeOrDeactiveMultiSpace(data).subscribe((res:any) => {
      this.alert.showAlert('success')
      this.selectedSpaces = []
      this.getSpaces()
    })

  }

  selectSpace(id: any) {
    console.log(id);

    const index = this.selectedSpaces.indexOf(id);
    if (index === -1) {
      this.selectedSpaces.push(id);
    } else {
      this.selectedSpaces.splice(index, 1);
    }
    this.isAllSelected()
  }

  toggleSelectAll(checked: boolean) {
    if (checked) {
      // Select all spaces
      this.selectedSpaces = this.spaces.map(space => space.id);
    } else {
      // Deselect all spaces
      this.selectedSpaces = [];
    }
    console.log(this.selectedSpaces);  // For debugging
  }

  isAllSelected() {
    return this.selectedSpaces.length === this.spaces.length;
  }


}
