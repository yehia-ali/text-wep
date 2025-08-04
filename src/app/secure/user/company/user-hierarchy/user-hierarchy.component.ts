import { HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HierarchyService } from 'src/app/core/services/hierarchy.service';

interface UnifiedData {
  id?: number;
  name: string;
  jobTitle?: string;
  imageUrl?: string;
  subCount?: number;
  userCount?: number;
  children?: UnifiedData[];
  expanded?: boolean;
  level?: number;
  loaded?: boolean;
  code?: string;
  departmentName?: string;
}

@Component({
  selector: 'user-hierarchy',
  templateUrl: './user-hierarchy.component.html',
  styleUrls: ['./user-hierarchy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserHierarchyComponent {
  toggleNode(node: any): void {
    node.isOpen = !node.isOpen;
    if (node.isOpen && !node.loaded) {
      this.getData(node.id);
    }
  }
  selectedHirFilter = 1;
  userMode: boolean = true;
  placeMode: boolean = false;
  departmentMode: boolean = false;
  language = localStorage.getItem('language') || 'en';
  userChartData: any | UnifiedData[] = [];
  vertical: boolean = true;

  typeFilterList = [
    { number: 1, name: 'users' },
    { number: 2, name: 'departments' },
    { number: 3, name: 'places' },
    { number: 4, name: 'job_title' },
    { number: 5, name: 'levels' },
  ];
  jobTitleMode: boolean;
  levelsMode: boolean;

  constructor(private service: HierarchyService , private translate : TranslateService) {
    this.loadInitialData();
  }

  ngOnInit() {}

  // تغيير العرض بين الوضع الأفقي والرأسي
  changeView() {
    this.vertical = !this.vertical;
    setTimeout(() => {
      const element = document.getElementById('h-chart-content');
      const ddd = document.querySelector('.p-organizationchart-table') as HTMLElement;
      if (element && ddd) {
        const width = (ddd.offsetWidth / 2) - (element.offsetWidth / 2);
        element.scrollTo({
          left: width,
          behavior: 'smooth'
        });
      }
    }, 0);
  }

  // تحميل البيانات الأولية للمستخدمين
  loadInitialData() {
    const params = new HttpParams();
    this.service.getUserHierarchy(params).subscribe((res: any) => {
      this.userChartData = res.map((user: any) => this.convertToUnifiedData(user));
      if (res.length > 0) {
        this.getData(res[0]?.manager?.id);
      }
    });
  }

  // تحميل بيانات الأقسام
  loadDepartmentData() {
    const params = new HttpParams();
    this.service.getDepartmentHierarchy(params).subscribe((res: any) => {
        const children:[] = res.items? res.items.map((department: any) => this.convertToUnifiedData(department) ) : [];
        this.userChartData = [
          {
            name: this.translate.instant('company'),
            jobTitle: '-',
            subCount: res.items.length,
            children: children,
            expanded: true,
            level: 1,
            loaded: false,
          }
        ]
    });
  }
  // تحميل بيانات الأقسام
  loadJobTitleData() {
    const params = new HttpParams();
    this.service.getJobTitleHierarchy(params).subscribe((res: any) => {
        const children:[] = res ? res.map((jobTitle: any) => this.convertToUnifiedData(jobTitle) ) : [];
        this.userChartData = [
          {
            name: this.translate.instant('company'),
            jobTitle: '-',
            subCount: res.length,
            children: children,
            expanded: true,
            level: 1,
            loaded: false
          }
        ]
    });
  }

  // تحميل بيانات الأماكن
  loadPlaceData() {
    const params = new HttpParams();
    this.service.getPlacesHierarchy(params).subscribe((res: any) => {

      const children:[] = res? res.map((place: any) => this.convertToUnifiedData(place) ) : [];
        this.userChartData = [
          {
            name: this.translate.instant('company'),
            jobTitle: '-',
            subCount: res.length,
            children: children,
            expanded: true,
            level: 1,
            loaded: false
          }
        ]
    });
  }
  loadLevelData() {
    const params = new HttpParams();
    this.service.getLevelsHierarchy(params).subscribe((res: any) => {

      const children:[] = res? res.map((place: any) => this.convertToUnifiedData(place) ) : [];
        this.userChartData = [
          {
            name: this.translate.instant('company'),
            jobTitle: '-',
            subCount: res.length,
            children: children,
            expanded: true,
            level: 1,
            loaded: false
          }
        ]
    });
  }

  // إعداد البيانات لعرضها بناءً على الفلتر المحدد
  displayedData(filterNumber: number) {
    this.userChartData = [];
    this.userMode = false
    this.departmentMode = false
    this.placeMode = false
    this.selectedHirFilter = filterNumber
    setTimeout(() => {
      if (filterNumber === 1) {
        this.userMode = true
        this.loadInitialData();
      } else if (filterNumber === 2) {
        this.departmentMode = true
        this.loadDepartmentData();
      } else if (filterNumber === 3) {
        this.placeMode = true
        this.loadPlaceData();
      } else if (filterNumber === 4) {
        this.jobTitleMode = true
        this.loadJobTitleData();
      }else if (filterNumber === 5) {
        this.levelsMode = true
        this.loadLevelData();
      }
    }, 0);
  }

  // جلب بيانات المستخدمين باستخدام managerId وتحديث البيانات
  getData(itemId: number | null) {
    if (itemId == null) return;
    let params = new HttpParams()
    if(this.userMode){
      params = params.set('managerId', itemId);
      this.service.getUserHierarchy(params).subscribe((res: any) => {
        const parentNode:any = this.findNodeById(this.userChartData, itemId);
        if (parentNode) {
          parentNode.loaded = true;
          parentNode.children = [
            ...parentNode.children,
            ...res.map((user: any) => ({
              ...this.convertToUnifiedData(user),
              level: (parentNode.level || 1) + 1,
              expanded: true,
              loaded: false
            }))
          ];
          this.userChartData = [...this.userChartData];
        }
      });
    } else if(this.departmentMode){
      params = params.set('Department', itemId);
      this.service.getDepartmentHierarchy(params).subscribe((res: any) => {
        const parentNode:any = this.findNodeById(this.userChartData, itemId);
        if (parentNode) {
          parentNode.loaded = true;
          parentNode.children = [
            ...parentNode.children,
            ...res.items.map((user: any) => ({
              ...this.convertToUnifiedData(user),
              level: (parentNode.level || 1) + 1,
              expanded: true,
              loaded: false
            }))
          ];
          this.userChartData = [...this.userChartData];
        }
      });
    } else if(this.placeMode){
      params = params.set('ParentId', itemId);
      this.service.getPlacesHierarchy(params).subscribe((res: any) => {
        const parentNode:any = this.findNodeById(this.userChartData, itemId);
        if (parentNode) {
          parentNode.loaded = true;
          parentNode.children = [
            ...parentNode.children,
            ...res.map((user: any) => ({
              ...this.convertToUnifiedData(user),
              level: (parentNode.level || 1) + 1,
              expanded: true,
              loaded: false
            }))
          ];
          this.userChartData = [...this.userChartData];
        }
      });
    } else if(this.jobTitleMode){
      params = params.set('ParentId', itemId);
      this.service.getJobTitleHierarchy(params).subscribe((res: any) => {
        const parentNode:any = this.findNodeById(this.userChartData, itemId);
        if (parentNode) {
          parentNode.loaded = true;
          parentNode.children = [
            ...parentNode.children,
            ...res.map((jobTitle: any) => ({
              ...this.convertToUnifiedData(jobTitle),
              level: (parentNode.level || 1) + 1,
              expanded: true,
              loaded: false
            }))
          ];
          this.userChartData = [...this.userChartData];
        }
      });
    } else if(this.levelsMode){
      params = params.set('ParentId', itemId);
      this.service.getLevelsHierarchy(params).subscribe((res: any) => {
        const parentNode:any = this.findNodeById(this.userChartData, itemId);
        if (parentNode) {
          parentNode.loaded = true;
          parentNode.children = [
            ...parentNode.children,
            ...res.map((user: any) => ({
              ...this.convertToUnifiedData(user),
              level: (parentNode.level || 1) + 1,
              expanded: true,
              loaded: false
            }))
          ];
          this.userChartData = [...this.userChartData];
        }
      });
    }
  }

  // دالة للعثور على عقدة بناءً على id
  findNodeById(nodes: UnifiedData[], id: number): UnifiedData | null {
    for (let node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const foundNode = this.findNodeById(node.children, id);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  }

  // تحويل البيانات إلى الهيكل الموحد بناءً على الوضع الحالي
  convertToUnifiedData(data: any): UnifiedData {
    if (this.departmentMode) {
      return {
        id: data.id,
        name: data.name,
        jobTitle: data.managerJobTitle,
        subCount: data.subCount,
        children: [],
        expanded: true,
        level: 1,
        loaded: false
      };
    } else if (this.placeMode) {
      return {
        name: this.language === 'ar' ? data.nameAr : data.nameEn,
        jobTitle: data.managerName + (data.managerJobTitle ? ' ( ' + data.managerJobTitle + ' ) ' : '' ),
        id: data.id,
        subCount: data.subsCount,
        children: [],
        expanded: true,
        level: 1,
        loaded: false
      };
    }else if (this.levelsMode) {
      return {
        name: this.language === 'ar' ? data.nameAr : data.nameEn,
        jobTitle: data.managerName + (data.managerJobTitle ? ' ( ' + data.managerJobTitle + ' ) ' : '-' ),
        id: data.id,
        subCount: data.subsCount,
        children: [],
        expanded: true,
        level: 1,
        loaded: false
      };
    } else if (this.userMode) {
      return {
        id: data.manager?.id,
        name: data.manager?.name,
        jobTitle: data.manager?.jobTitle,
        imageUrl: data.manager?.imageUrl,
        subCount: data.userCount,
        code: data.manager.code,
        departmentName: data.manager.departmentName,
        children: [],
        expanded: true,
        level: 1,
        loaded: false
      };
    } else if (this.jobTitleMode) {
      return {
        id: data?.id,
        name: this.language === 'ar' ? data.nameAr : data.nameEn,
        jobTitle: data?.description,
        subCount: data?.subCount,
        children: [],
        expanded: true,
        level: 1,
        loaded: false
      };
    }
    return {} as UnifiedData;
  }
}
