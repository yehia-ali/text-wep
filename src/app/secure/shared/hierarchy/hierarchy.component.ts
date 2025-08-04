import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutComponent} from "../../../core/components/layout.component";
import {MatTreeModule, MatTreeNestedDataSource} from "@angular/material/tree";
import {MagicScrollDirective} from "../../../core/directives/magic-scroll.directive";
import {NotFoundComponent} from "../../../core/components/not-found.component";
import {LoadingComponent} from "../../../core/components/loading.component";
import {NestedTreeControl} from "@angular/cdk/tree";
import { HierarchyService } from 'src/app/core/services/hierarchy.service';
import {HierarchyCardComponent} from "../../../core/components/hierarchy-card.component";

interface HierarchyNode {
  manager: any;
  users?: HierarchyNode[];
  havePermissionToView: boolean;
}


@Component({
  selector: 'hierarchy',
  standalone: true,
  imports: [CommonModule, LayoutComponent, MatTreeModule, MagicScrollDirective, NotFoundComponent, LoadingComponent, HierarchyCardComponent],
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent  implements OnInit {
  teamHierarchy!: HierarchyNode[];
  treeControl = new NestedTreeControl<HierarchyNode>(node => node.users);
  dataSource = new MatTreeNestedDataSource<HierarchyNode>();
  hasChild = (_: number, node: HierarchyNode) => !!node.users && node.users.length > 0;
  loading = true;
  constructor(private service: HierarchyService) {
    this.dataSource.data = this.teamHierarchy;
  }

  ngOnInit(): void {
    this.service.teamHierarchy.subscribe(res => {
      this.teamHierarchy = res;
      this.dataSource.data = this.teamHierarchy;
      this.loading = false;
    });

    if (this.teamHierarchy.length == 0) {
      this.getTeamHierarchy();
    }
  }

  getTeamHierarchy() {
    this.loading = true;
    this.service.getTeamHierarchy().subscribe(() => {
      this.dataSource.data = this.teamHierarchy;
      this.loading = false;
    })
  }

}
