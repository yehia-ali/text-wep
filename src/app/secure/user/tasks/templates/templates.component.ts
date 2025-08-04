import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {LayoutWithFiltersComponent} from "../../../../core/components/layout-with-filters.component";
import {NgxPaginationModule} from "ngx-pagination";
import {NotFoundComponent} from "../../../../core/components/not-found.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {InfoSidebarComponent} from "../../../../core/components/info-sidebar.component";
import {MatMenuModule} from "@angular/material/menu";
import {ArabicDatePipe} from "../../../../core/pipes/arabic-date.pipe";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {ConfirmationMessageComponent} from "../../../../core/dialogs/confirmation-message.component";
import {NavigationStart, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {AdminTemplates} from 'src/app/core/interfaces/admin-templates';
import {TemplateCategory} from "../../../../core/interfaces/template-category";
import {TemplatesService} from "../../../../core/services/templates.service";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {TemplateFormComponent} from 'src/app/core/components/template-form/template-form.component';
import {CategoryFormComponent} from "../../../../core/components/category-form/category-form.component";
import {TemplatesFilterComponent} from "../templates-filter/templates-filter.component";
import {AlertService} from "../../../../core/services/alert.service";

@Component({
  selector: 'templates',
  standalone: true,
  imports: [CommonModule, PriorityComponent, TranslateModule, LayoutWithFiltersComponent, NgxPaginationModule, NotFoundComponent, LoadingComponent, InfoSidebarComponent, MatMenuModule, ArabicDatePipe, ArabicNumbersPipe, PriorityComponent, TemplatesFilterComponent],
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit, OnDestroy {

  templates: AdminTemplates[] = [];
  categories: TemplateCategory[] = [];
  dir = document.dir
  openSidebar = false;
  loading = false;
  meta: any;
  selectedTemplate!: AdminTemplates;
  selectedCategory!: TemplateCategory;
  sub!: Subscription;

  constructor(public service: TemplatesService, private dialog: MatDialog, private router: Router, private alert: AlertService) {
  }

  ngOnInit(): void {
    this.sub = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {

      }
    })
    this.service.loading.subscribe((res: any) => this.loading = res);
    this.service.meta.subscribe((res: any) => {
      this.meta = res;
    });
    this.service.templates.subscribe((res: any) => this.templates = res);
    this.service.categories.subscribe((res: any) => this.categories = res);
    this.getTemplates()
    this.getCategories()
  }

  getTemplates() {
    this.service.loading.next(true);
    this.service.getTemplates().subscribe(res => {
      this.templates = res;
      this.service.loading.next(false);
    })
  }

  getCategories() {
    this.service.getCategories().subscribe(res => {
      this.categories = res;
    })
  }


  manageCategory() {
    this.openSidebar = false;
    setTimeout(() => {
      this.openSidebar = true;
    }, 0);
  }

  templateForm(edit = false) {
    let dialog = this.dialog.open(TemplateFormComponent, {
      panelClass: 'create-task-dialog',
      data: {
        formType: edit ? 'edit' : 'create',
        ...(edit && {template: this.selectedTemplate})
      }
    });
  }

  categoryForm(edit = false) {
    let dialog = this.dialog.open(CategoryFormComponent, {
      panelClass: 'small-dialog',
      data: {
        formType: edit ? 'edit' : 'create',
        ...(edit && {category: this.selectedCategory})
      }
    });
  }

  deleteTemplate() {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_template_message',
        btn_name: "delete",
        classes: 'w-100 bg-danger',
        selectedTemplate: this.selectedTemplate
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.service.deleteTemplate(this.selectedTemplate.id).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('template_deleted')
            this.getTemplates();
            this.service.getCategories().subscribe();
          }
        })
      }
    })
  }

  deleteCategory() {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_category_message',
        btn_name: "delete",
        classes: 'w-100 bg-danger',
        selectedCategory: this.selectedCategory
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.service.deleteCategory(this.selectedCategory.id).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('category_deleted')
            this.getCategories()
          }
        })
      }
    })
  }

  trackBy(index: any, item: any) {
    return item.id;
  }

  pageChanged(e: any) {
    this.service.page.next(e)
    this.getTemplates();
  }

  limitChanged(e: any) {
    this.service.page.next(1);
    this.service.limit.next(e);
    this.getTemplates();
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

}
