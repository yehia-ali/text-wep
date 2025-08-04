import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterLabelComponent } from './filter-label.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HrEmployeesService } from '../services/hr-employees.service';

@Component({
  selector: 'banks',
  standalone: true,
  imports: [
    CommonModule,
    FilterLabelComponent,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  template: `
    <div class="flex-grid">
      <div class="col-lg-6">
        <i *ngIf="icon" class="fs-11 mr-50 bx bxs-bank"></i>
        <filter-label [key]="'bank'" *ngIf="labelVisibilty" />
        <ng-select
          *ngIf="formControlBank"
          [items]="allIBanks"
          [formControlName]="formControlBank"
          bindLabel="bankName"
          bindValue="id"
          class="{{ width }} icon-input"
          appendTo="body"
          [multiple]="multiable"
          (change)="getBrances($event.id)"
          [closeOnSelect]="closeOnSelect"
        >
        </ng-select>
      </div>

      <div class="col-lg-6">
        <i *ngIf="icon" class="fs-11 mr-50 bx buildings"></i>
        <filter-label [key]="'bank_branch'" *ngIf="labelVisibilty" />
        <ng-select
          *ngIf="formControlBrache"
          [items]="allIBrances"
          [formControlName]="formControlBrache"
          bindLabel="branchName"
          bindValue="id"
          class="{{ width }} icon-input"
          appendTo="body"
          [multiple]="multiable"
          [closeOnSelect]="closeOnSelect"
        >
        </ng-select>
      </div>
    </div>
  `,
  styles: [],
})
export class BanksComponent {
  @Input() icon = true;
  @Input() selectedDepartment: any;
  @Input() label = 'country';
  @Input() labelVisibilty = true;
  @Input() width = 'w-100';
  @Input() multiable = false;
  @Input() closeOnSelect = true;
  @Input() formControlBank: any = null;
  @Input() formControlBrache: any = null;
  @Output() valueChanged = new EventEmitter<string>();

  searchValue: any;
  totalItems: any;
  allIBanks: any;
  allIBrances: any;

  constructor(private service: HrEmployeesService) {}

  ngOnInit() {
    this.getItems();
  }

  search(event: any) {
    this.searchValue = event.term;
    this.getItems();
  }
  getItems() {
    let params: any = {
      limit: 30,
      search: this.searchValue,
    };
    this.service.getAllBanks().subscribe((res: any) => {
      this.allIBanks = res.data.items;
      this.totalItems = res.data.totalItems;
    });
  }
  getBrances(bankId: any) {
    this.service.getAllBankBranches(bankId).subscribe((res: any) => {
      this.allIBrances = res.data.items;
    });
  }
  onChange() {
    this.valueChanged.emit(this.selectedDepartment);
  }
}
