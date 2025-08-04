import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingComponent} from "../../../core/components/loading.component";
import {NotFoundComponent} from "../../../core/components/not-found.component";
import {LayoutWithFiltersComponent} from "../../../core/components/layout-with-filters.component";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {ArabicNumbersPipe} from "../../../core/pipes/arabic-numbers.pipe";
import {ConfirmationMessageComponent} from "../../../core/dialogs/confirmation-message.component";
import {Observable} from "rxjs";
import {Package} from "../../../core/interfaces/package";
import {PackagesService} from "../../../core/services/packages.service";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../../core/services/alert.service";
import {PackageFormComponent} from "./package-form/package-form.component";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {LayoutService} from "../../../core/services/layout.service";

@Component({
  selector: 'packages',
  standalone: true,
  imports: [CommonModule, LoadingComponent, NotFoundComponent, LayoutWithFiltersComponent, MatButtonModule, TranslateModule, NgxPaginationModule, ArabicNumbersPipe, UserNavbarComponent],
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  packages$: Observable<Package[]> = this.service.packages$;
  loading = false;
  meta: any

  constructor(private service: PackagesService, private dialog: MatDialog, private alert: AlertService, private layoutSer: LayoutService) {
  }

  ngOnInit(): void {
    this.layoutSer.withSubMenu.next(false)
    this.service.meta.subscribe(res => this.meta = res)
    this.getPackages();
  }

  getPackages() {
    this.service.getPackages().subscribe()
  }

  createPackage() {
    this.dialog.open(PackageFormComponent, {
      panelClass: 'large-dialog'
    })
  }

  edit(_package: Package) {
    this.dialog.open(PackageFormComponent, {
      panelClass: 'large-dialog',
      data: {
        _package,
        isEdit: true
      }
    })
  }


  deletePackage(id: number) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_package',
        btn_name: 'confirm',
        classes: 'bg-danger white'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.deletePackage({id}).subscribe(() => {
          this.service.getPackages().subscribe();
          this.alert.showAlert('package_deleted');
        })
      }
    })

  }

  trackBy(index: any, item: any) {
    return item.spaceId;
  }
}
