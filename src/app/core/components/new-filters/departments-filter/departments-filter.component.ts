import { Department } from './../../../interfaces/department';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NewFiltersService } from 'src/app/core/services/new-filters.service';
import { HttpParams } from '@angular/common/http';
import { TreeSelectModule } from 'primeng/treeselect';

@Component({
  selector: 'app-departments-filter',
  standalone: true,
  templateUrl: './departments-filter.component.html',
  styleUrls: ['./departments-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, DropdownModule, TranslateModule, TreeSelectModule],
})
export class DepartmentFilterComponent {
  @Output() valueChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() small = true;
  @Input() icon = true;
  @Input() startDropDown = true;
  @Input() tree = false;
  @Input() labelTitle = 'departments';
  @Input() selectedValue: any = this.tree  ? [] : null ; // تعمل مع عدة قيم
  list: any[] | undefined;
  searchValue: any;
  selectedNodes: any[] = []; // لعقد الشجرة المختارة
  treeList: any;
  multi: boolean = false;

  constructor(private service: NewFiltersService) {}

  ngOnInit() {
    this.getList();
  }

  getList() {
    let params = new HttpParams().set('page', '1').set('limit', '100');

    this.service.getDepartments(params).subscribe((res: any) => {
      this.list = res.items;

      if (this.tree) {
        const data = this.buildTree(res.items);
        setTimeout(() => {
          this.treeList = this.addHierarchicalKeys(data);
          this.syncTreeSelection();
        }, 0);
      }else{
        this.syncSelectedValues();
      }
    });
  }

  syncSelectedValues() {
    if (!this.list || !this.selectedValue) return;
    if (!this.multi) {
      const selected = this.list.find((item) => item.id === this.selectedValue[0]);
      this.selectedValue = selected ? [selected] : [];
    } else {
      this.selectedNodes = this.list.filter((item) => this.selectedValue.includes(item.id));
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
      if (node.key === key) {
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
    let Departments :any
    if(this.tree){
      this.selectedValue = [];
      if (Array.isArray(event)) {
        event.forEach((item: any) => {
          this.selectedValue.push(item.key);
        });
      }
      Departments = this.selectedValue
    }else{
      this.selectedValue = event
      Departments = event.id
    }
    this.valueChanged.emit(Departments);
  }

  buildTree(data: any[]): any[] {
    const tree: any[] = [];
    const lookup: any = {};

    data.forEach((item) => {
      lookup[item.id] = {
        key: item.id,
        label: item.name,
        data: {
          id: item.id,
          parentId: item.parentId,
          name: item.name,
        },
        children: [],
      };
    });

    data.forEach((item) => {
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
      return {
        ...node,
        key: node.key, // المفتاح يبقى كما هو لأنه معرف بالفعل بـ id
        children: this.addHierarchicalKeys(node.children || [], currentKey),
      };
    });
  }

  displaySelectedValues(values: any[]): string {
    return values?.map((item) => item.label).join(', ');
  }
}
