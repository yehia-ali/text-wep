import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CountriesService} from "../../../services/countries.service";
import {PackagesService} from "../../../services/packages.service";
import {BehaviorSubject} from "rxjs";
import {InputLabelComponent} from "../../../inputs/input-label.component";
import {MatButtonModule} from "@angular/material/button";
import {DateFilterComponent} from "../../date-filter.component";
import {SearchComponent} from "../../search.component";

@Component({
  selector: 'spaces',
  standalone: true,
  providers: [
    DatePipe, // Add DatePipe here
  ],
  imports: [CommonModule, NgSelectModule, TranslateModule, InputLabelComponent, MatButtonModule, DateFilterComponent, SearchComponent],
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss']
})
export class SpacesComponent implements OnInit {
  @Input() service: any
  @Input() canExport = true;
  @Input() moreFilters = true;
  @Input() usersPage = false;
  status = null;
  @Input() tasksPage = false;
  @Output() emitChange = new EventEmitter<any>();
  @Output() export = new EventEmitter<any>();
  timeOut: any
  showFilters = false;
  // visibleFilters: any = {};
  filtersArray: any;
  countries!: any;
  packages = []
  dir = document.dir;
  dateValue:any ='';
  date:any ='';

  @HostListener('document:click', ['$event']) documentClickEvent($event: MouseEvent) {
    this.showFilters = false;
  }

  constructor(public translate: TranslateService, private packagesService: PackagesService, private countriesSer: CountriesService, private datePipe: DatePipe) {
    this.packagesService.getPackages().subscribe((res: any) => this.packages = res);
    this.countriesSer.getCountries().subscribe((res: any) => this.countries = res);
  }


  ngOnInit(): void {
  }

  filter(value?: any, key?: BehaviorSubject<any>) {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.service.currentPage.next(1);
      if (key instanceof BehaviorSubject) {
        key.next(value);
      }
      this.emitChange.emit(value);
    }, 500);
  }

  search(value: any, key: any) {
    key?.next(value);
  }

  emitFilter(event: any, key: any) {
    this.filter(event.target.value, key);
  }

  exportFun() {
    this.export.emit()
  }
  changeDate(event:any , key:any) {
    const formattedDate = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.filter(formattedDate, key);
    console.log(formattedDate)
  }
}
