import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NewFiltersService } from 'src/app/core/services/new-filters.service';
import { HttpParams } from '@angular/common/http';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-places-filter',
  standalone: true,
  templateUrl: './places-filter.component.html',
  styleUrls: ['./places-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, DropdownModule , TranslateModule , TreeSelectModule , MultiSelectModule]
})
export class PlacesFilterComponent {
  @Input() selectedValue: any;
  @Output() valueChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() small = true;
  @Input() icon = true;
  @Input() startDropDown = true;
  @Input() tree = false;
  @Input() labelTitle = 'places';
  @Input() multi= false;
  list: any[] = []
  searchValue: any;
  selectedNodes: any[] = [];
  treeList: any[] = [];
  searchSubject = new Subject<any>();
  language = localStorage.getItem('language')
  constructor(private service : NewFiltersService){
    this.searchSubject
      .pipe(
        debounceTime(500), // انتظار 500 مللي ثانية بين التحديثات
        distinctUntilChanged() // التأكد من أن القيمة جديدة
      )
      .subscribe((value) => {
        this.searchValue = value; // تحديث قيمة البحث
        this.getList(); // استدعاء دالة البحث
      });

  }
  ngOnInit(){
    this.getList()
  }

  getList(){
    let params = new HttpParams()
    params = params.set('page' , '1').set('limit' , '1000')
    if(this.searchValue){
      params = params.set('search',this.searchValue)
    }
    this.service.getPlaces(params).subscribe((res:any) => {
      if (this.tree) {
        let data = this.buildTree(res.items);
        setTimeout(() => {
          this.treeList = this.addHierarchicalKeys(data);
          this.syncTreeSelection();
        }, 0);
      }else{
        this.list = res.items;
        this.syncSelectedValues();
      }
    })
  }

  syncSelectedValues() {
    if (!this.list || !this.selectedValue) return;

    if (!this.multi) {
      // Dropdown - تحديد عنصر واحد
      this.selectedValue = this.list.find(item => item.id === this.selectedValue) || null;
    } else {
      // MultiSelect - تحديد عناصر متعددة
      this.selectedNodes = this.list.filter(item => this.selectedValue.includes(item.id));
    }
  }

  syncTreeSelection() {
    if (!this.treeList || !this.selectedValue) return;
    this.selectedNodes = [];
    this.selectedValue.forEach((value:any) => {
      const node = this.findNodeInTree(this.treeList, value);

      if (node) {
        this.selectedNodes.push(node);
      }
    });
  }
  findNodeInTree(nodes: any[], key: any): any {
    for (const node of nodes) {
      if (node.data.id === key) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const childNode = this.findNodeInTree(node.children, key);
        if (childNode) {
          return childNode;
        }
      }
    }
    return null;
  }

  onChange(event?: any) {
    this.selectedValue = [];
    if (Array.isArray(event)) {
      event.forEach((item: any) => {
        this.selectedValue.push(item.id || item.data.id);
      });
    }
    this.valueChanged.emit(this.selectedValue);
  }

  search(event:any){
    // this.searchSubject.next(event);
  }

  buildTree(data: any[]): any[] {
    const tree: any[] = [];
    const lookup: any = {};

    data.forEach(item => {
      lookup[item.id] = {
        key: item.id,
        label: this.language == 'ar' ? item.nameAr : item.nameEn,
        data: {
          id: item.id,
          managerName: item.managerName,
          parentId: item.parentId,
          name:this.language == 'ar' ? item.nameAr : item.nameEn,
          managerImageUrl: item.managerImageUrl
        },
        children: []
      };
    });

    data.forEach(item => {
      if (item.parentId && lookup[item.parentId]) {
        lookup[item.parentId].children.push(lookup[item.id]);
      } else {
        tree.push(lookup[item.id]);
      }
    });
    return tree;
  }

  addHierarchicalKeys(data: any[], parentKey: string = ''): any[] {
    return data.map((node, index) => {
        const currentKey = parentKey ? `${parentKey}-${index}` : `${index}`;
        let result = {
          ...node, // الاحتفاظ بجميع البيانات الأصلية
          key: currentKey, // إضافة المفتاح الهرمي
          children: this.addHierarchicalKeys(node.children || [], currentKey) // معالجة الأطفال مع المفتاح الحالي
      };
        return result
    });
}

displaySelectedValues(values: any[]): string {
  return values?.map(item => item.label).join(', ');
}

}
