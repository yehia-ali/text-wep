import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../../core/services/user.service";
import {Department} from 'src/app/core/interfaces/department';
import {DepartmentsService} from 'src/app/core/services/departments.service';
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../../../../core/components/user-image.component";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MatButtonModule} from "@angular/material/button";
import {DepartmentFormComponent} from "./department-form/department-form.component";
import {Subscription} from "rxjs";
import {RolesService} from "../../../../core/services/roles.service";

@Component({
  selector: 'departments',
  standalone: true,
  imports: [CommonModule, MagicScrollDirective, MatTooltipModule, TranslateModule, UserImageComponent, NotFoundComponent, LoadingComponent, LayoutComponent, MatButtonModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  departments: Department[] = []
  loading = true;
  isAdmin = false;
  source$!: Subscription;

  constructor(private dialog: MatDialog, private service: DepartmentsService, private rolesSer: RolesService) {
  }

  ngOnInit(): void {
    this.rolesSer.canAccessAdmin.subscribe(res => this.isAdmin = res)
    this.service.departments.subscribe(res => {
      this.departments = res;
      if (this.departments.length > 0) {
        this.loading = false;
      }
    });

    if (this.departments.length === 0) {
      this.getDepartments();
    }
  }

  getDepartments() {
    this.loading = true;
    this.source$ = this.service.getDepartments().subscribe(() => this.loading = false)
  }

  addDepartment() {
    this.dialog.open(DepartmentFormComponent, {
      panelClass: 'small-dialog',
      data: {
        title: 'add_department',
        btn: 'save',
        createMode:true
      }
    });
  }

  editDepartment(department: Department) {
    this.dialog.open(DepartmentFormComponent, {
      panelClass: 'small-dialog',
      data: {
        title: 'edit_department',
        btn: 'save',
        department
      }
    });
  }

  trackBy(index: number, department: Department) {
    return department.id;
  }

  ngOnDestroy() {
    this.source$.unsubscribe();
  }
}
