import {Component, ElementRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {LayoutWithFiltersComponent} from "../../../core/components/layout-with-filters.component";
import * as XLSX from "xlsx";
import {SpaceConfigurationComponent} from "../../user/hr/leaves-settings/space-configuration/space-configuration.component";
import {ConfirmationMessageComponent} from "../../../core/dialogs/confirmation-message.component";
import {MatDialog} from "@angular/material/dialog";
import {GlobalService} from "../../../core/services/global.service";
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

@Component({
  selector: 'all-spaces',
  standalone: true,
  imports: [MatButtonModule ,MatCheckboxModule , CommonModule, RouterOutlet, UserNavbarComponent, LayoutWithFiltersComponent, SortingComponent, TranslateModule, NgxPaginationModule, ArabicDatePipe, MatChipsModule, MatTooltipModule, NotFoundComponent, LoadingComponent, MatSlideToggleModule, SpacesComponent],
  templateUrl: './all-spaces.component.html',
  styleUrls: ['./all-spaces.component.scss']
})
export class AllSpacesComponent implements OnInit {

  selectedSpaces: any[] = [];
  meta: any
  spaces: any[] = [];
  loading = false;
  dir = document.dir;
  timeout: any;
  layout = inject(LayoutService);
  alert = inject(AlertService);

  constructor(public service: SpacesService, private dialog: MatDialog, private elm: ElementRef) {
  }

  ngOnInit(): void {
    this.layout.withSubMenu.next(false);
    this.service.spaces.subscribe(res => this.spaces = res);
    this.service.loading.subscribe(res => this.loading = res);
    this.service.meta.subscribe(res => this.meta = res);
    if (this.spaces.length == 0) {
      this.service.search.next('');
    }
  }

  getSpaces() {
    this.service.getAllSpaces().subscribe()
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
            this.service.getAllSpaces().subscribe()
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
    localStorage.setItem('space-id', JSON.stringify(space.spaceId));
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

  search($event: string) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.service.currentPage.next(1)
      this.service.search.next($event);
      this.getSpaces()
    }, 500);
  }

  sort(value: any, direction: any) {
    this.service.currentPage.next(1)
    this.service.sort.next(value)
    this.service.sortDirection.next(direction)
    this.getSpaces()
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
    return item.spaceId;
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
      this.selectedSpaces = this.spaces.map(space => space.spaceId);
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
