import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { LayoutWithFiltersComponent } from 'src/app/core/components/layout-with-filters.component';
import { LoadingComponent } from 'src/app/core/components/loading.component';
import { NotFoundComponent } from 'src/app/core/components/not-found.component';
import { UserImageComponent } from 'src/app/core/components/user-image.component';
import { ArabicNumbersPipe } from 'src/app/core/pipes/arabic-numbers.pipe';
import { PenaltiesService } from 'src/app/core/services/penalties.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from 'src/app/core/filters/search.component';
import { LevelsFilterComponent } from 'src/app/core/components/new-filters/levels-filter/levels-filter.component';
import { DateFilterComponent } from 'src/app/core/filters/date-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AssignPenaltyComponent } from '../assign-penalty/assign-penalty.component';
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { Repetition } from 'src/app/core/enums/repetition';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { ConfirmationMessageComponent } from 'src/app/core/dialogs/confirmation-message.component';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'penalties',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    SearchComponent,
    LevelsFilterComponent,
    DateFilterComponent,
    NgSelectModule,
    TranslateModule,
    NgxPaginationModule,
    LayoutWithFiltersComponent,
    UserImageComponent,
    LoadingComponent,
    NotFoundComponent,
    ArabicNumbersPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './penalties.component.html',
  styleUrls: ['./penalties.component.scss'],
})
export class PenaltiesComponent {
  alert = inject(AlertService);
  service = inject(PenaltiesService);
  hrService = inject(HrEmployeesService);
  translate = inject(TranslateService);
  dialog = inject(MatDialog);
  penaltyTypes: any[] = [];
  penalties: any[] = [];
  loading = false;
  meta: any;
  currentLang: string = '';
  repetition: any[] = enumToArray(Repetition);
  constructor() {
    this.currentLang = this.translate.currentLang;
    this.service.penalties$.subscribe(res => {
      this.service.meta.subscribe(res => this.meta = res);
      this.service.loading.subscribe(res => this.loading = res);
      this.penalties = res
    });

  }
  ngOnInit(): void {
    this.getAllPenaltyTypes();
  }
  getAllPenaltyTypes(){
    this.hrService.getAllPenaltiesType().subscribe((res: any) => {
      this.penaltyTypes = res.data;
    });
  }

  trackBy(index: any, item: any) {
    return item.id;
  }
  dateChanged(event: any) {
    this.service.month.next(event);
    this.service.hasChanged.next(true);
  }
  assignPenalty() {
    this.dialog.open(AssignPenaltyComponent, {
      width: '590px',
      data: {
        assign: true, 
        penalty: null,
      },
    });
  }
  deletePenalty(id: any) {
    let dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      panelClass: 'confirmation-dialog',
      data: {
        message: 'delete_penalty',
        btn_name: 'confirm',
        classes: 'bg-danger white',
        id: id
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.loading.next(true);
        this.service.deletePenalty(id).subscribe((res: any) => {
          if (res.success) {
            this.service.loading.next(false);
            this.alert.showAlert('penalty_deleted');
            this.service.hasChanged.next(true);
          }
          else{
            this.service.hasChanged.next(true);
            this.service.loading.next(false);
          }
        });
      }
    });
  }

}
