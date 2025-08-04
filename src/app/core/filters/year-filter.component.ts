import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment/moment';

@Component({
  selector: 'year-filter',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <label class="fs-11 bold" *ngIf="showLabel">{{ label | translate }}</label>
    <div class="year-filter-container" [class]="classes" #yearFilterContainer>
      <div class="year-filter-button" (click)="toggleDropdown($event)">
        <div class="year-display">
          {{ getDisplayYear() }}
        </div>
        <div class="calendar-icon">
          <img src="assets/images/icons/calendar-icon-2.svg" alt="calendar" />
        </div>
      </div>
      
      <div class="year-dropdown" *ngIf="isDropdownOpen" (click)="$event.stopPropagation()">
        <div class="dropdown-header">
          <button class="nav-btn" (click)="previousDecade()" [disabled]="currentDecadeStart <= minYear">
            <i class="bx bx-chevron-left"></i>
          </button>
          <span class="decade-range">{{ currentDecadeStart }} - {{ currentDecadeEnd }}</span>
          <button class="nav-btn" (click)="nextDecade()" [disabled]="currentDecadeEnd >= maxYear">
            <i class="bx bx-chevron-right"></i>
          </button>
        </div>
        <div class="years-grid">
          <button 
            *ngFor="let year of yearsInDecade" 
            class="year-option"
            [class.selected]="year === selectedYear"
            [class.disabled]="year < minYear || year > maxYear"
            (click)="selectYear(year)"
            [disabled]="year < minYear || year > maxYear">
            {{ year }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .year-filter-container {
      position: relative;
    }

    .year-filter-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      background-color: #ffffff;
      border: 0.5px solid var(--divder, rgba(0, 0, 0, 0.15));
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 32px;
    }

    .year-filter-button:hover {
      background-color: #f8f9fa;
      border-color: #d0d0d0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .year-display {
      color: #495057;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      font-weight: 500;
      flex: 1;
      text-align: start;
    }

    .calendar-icon {
      color: #6c757d;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .year-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      margin-top: 4px;
      min-width: 200px;
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .nav-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: #6c757d;
      transition: all 0.2s ease;
    }

    .nav-btn:hover:not(:disabled) {
      background-color: #f8f9fa;
      color: #495057;
    }

    .nav-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .decade-range {
      font-weight: 500;
      color: #495057;
      font-size: 14px;
    }

    .years-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      padding: 12px;
    }

    .year-option {
      background: none;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      color: #495057;
      transition: all 0.2s ease;
      text-align: center;
    }

    .year-option:hover:not(.disabled) {
      background-color: #7b58ca;
      color: white;
    }

    .year-option.selected {
      background-color: #7b58ca;
      color: white;
    }

    .year-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class YearFilterComponent implements OnInit {
  @Input() start_date_key!: BehaviorSubject<any>;
  @Input() end_date_key!: BehaviorSubject<any>;
  @Input() selectedDate!: BehaviorSubject<any>;
  @Input() max!: Date;
  @Input() min!: Date;
  @Output() onChange = new EventEmitter<number>();
  @Input() classes!: string;
  @Input() label!: string;
  @Input() showLabel!: boolean;

  @ViewChild('yearFilterContainer', { static: true }) yearFilterContainer!: ElementRef;

  selectedYear: number = new Date().getFullYear();
  isDropdownOpen = false;
  currentDecadeStart: number;
  currentDecadeEnd: number;
  yearsInDecade: number[] = [];
  minYear = 1900;
  maxYear = 2100;

  constructor() {
    this.currentDecadeStart = Math.floor(this.selectedYear / 10) * 10;
    this.currentDecadeEnd = this.currentDecadeStart + 9;
    this.generateYearsInDecade();
  }

  ngOnInit(): void {
    // Set initial year from selectedDate if available
    if (this.selectedDate) {
      this.selectedDate.subscribe(res => {
        if (res) {
          let year: number;
          if (typeof res === 'string') {
            year = parseInt(res, 10);
          } else if (typeof res === 'number') {
            year = res;
          } else {
            year = moment(res).year();
          }
          
          if (!isNaN(year)) {
            this.selectedYear = year;
            this.currentDecadeStart = Math.floor(year / 10) * 10;
            this.currentDecadeEnd = this.currentDecadeStart + 9;
            this.generateYearsInDecade();
          }
        }
      });
    }

    // Set min/max years if provided
    if (this.min) {
      this.minYear = this.min.getFullYear();
    }
    if (this.max) {
      this.maxYear = this.max.getFullYear();
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!this.isDropdownOpen) return;
      
      if (this.yearFilterContainer && !this.yearFilterContainer.nativeElement.contains(target)) {
        this.isDropdownOpen = false;
      }
    });
  }

  toggleDropdown(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  previousDecade(): void {
    this.currentDecadeStart -= 10;
    this.currentDecadeEnd -= 10;
    this.generateYearsInDecade();
  }

  nextDecade(): void {
    this.currentDecadeStart += 10;
    this.currentDecadeEnd += 10;
    this.generateYearsInDecade();
  }

  generateYearsInDecade(): void {
    this.yearsInDecade = [];
    for (let i = 0; i < 10; i++) {
      this.yearsInDecade.push(this.currentDecadeStart + i);
    }
  }

  selectYear(year: number): void {
    this.selectedYear = year;
    this.isDropdownOpen = false;
    this.updateYearRange(year);
  }

  getDisplayYear(): number {
    return this.selectedYear;
  }

  private updateYearRange(year: number): void {
    // Set start date to January 1st of selected year
    if (this.start_date_key) {
      this.start_date_key.next(`${year}-01-01`);
    }

    // Set end date to December 31st of selected year
    if (this.end_date_key) {
      this.end_date_key.next(`${year}-12-31`);
    }

    this.onChange.emit(year);
  }
} 