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
  selector: 'app-users-filter',
  standalone: true,
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, DropdownModule , TranslateModule , TreeSelectModule , MultiSelectModule]
})
export class UsersFilterComponent {

  @Input() selectedValue: any;
  @Output() valueChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() small = true;
  @Input() icon = true;
  @Input() startDropDown = true;
  @Input() tree = false;
  @Input() labelTitle = 'users';
  @Input() multi= false;
  @Input() manager= false;
  @Input() getMyTeam= false;
  userId:any = localStorage.getItem('id')
  list: any[] = []
  searchValue: any;
  selectedNodes: any[] = [];
  treeList: any[] = [];
  searchSubject = new Subject<any>();

  constructor(private service : NewFiltersService){
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.searchValue = value
        this.getList();
      });

  }
  ngOnInit(){
    this.getList()
  }

  getList(){
    let params = new HttpParams()
    params = params.set('page' , '1').set('limit' , '100').set('isActive' , 'true')
    if(this.searchValue){
      params = params.set('search',this.searchValue)
    }
    if(this.manager){
      params = params.set('roleId' , '6f699169-e32a-46e4-ab07-1c96b910600b')
    }
    if(this.getMyTeam){
      params = params.set('managers' , this.userId)
    }
    this.service.getUsers(params).subscribe((res:any) => {
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
      this.selectedValue = this.list.find(item => item.id === this.selectedValue) || null;
    } else {
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
    }else{
      this.selectedValue = event
    }
    console.log(this.selectedValue);

    this.valueChanged.emit(this.selectedValue);
  }
  onClear() {

    this.selectedValue = null;
    this.valueChanged.emit({id:this.userId});
  }

  search(event:any){
    this.searchSubject.next(event);
  }

  buildTree(data: any[]): any[] {
    const tree: any[] = [];
    const lookup: any = {};
    data.forEach(item => {
      lookup[item.id] = {
        key: item.id,
        label: item.name,
        data: {
          id: item.id,
          managerId: item.managerId,
          managerName: item.managerName,
          name:item.name,
          managerImageUrl: item.managerImageUrl
        },
        children: []
      };
    });

    data.forEach(item => {
      if (item.managerId && lookup[item.managerId]) {
        lookup[item.managerId].children.push(lookup[item.id]);
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
          ...node,
          key: currentKey,
          children: this.addHierarchicalKeys(node.children || [], currentKey)
      };
        return result
    });
}

displaySelectedValues(values: any[]): string {
  return values?.map(item => item.label).join(', ');
}

}
