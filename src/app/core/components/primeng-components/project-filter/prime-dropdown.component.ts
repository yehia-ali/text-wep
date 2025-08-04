import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  templateUrl: './prime-dropdown.component.html',
  styleUrls: ['./prime-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, DropdownModule , TranslateModule]
})
export class AppDropdownComponent {
  @Input() selectedValue: any; // Adjust type if necessary
  @Output() valueChanged = new EventEmitter<any>();
  @Output() searchChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() title = '';
  @Input() small = true;
  @Input() icon = true;
  @Input() iconName :any;
  @Input() items:any[] = [];
  @Input() startDropDown = true;
  @Input() onlineSearch = true;
  searchSubject = new Subject<any>();
  searchValue: any;

  ngOnInit(){
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.searchChanged.emit(value);
      });

      console.log(this.items);


  }

  search(event:any){
    this.searchSubject.next(event.filter);
  }

  onChange(event:any) {
    this.selectedValue = event
    this.valueChanged.emit(this.selectedValue);
  }
}
