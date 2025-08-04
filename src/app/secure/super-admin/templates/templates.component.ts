import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {TemplatesComponent} from "../../user/tasks/templates/templates.component";
import {LayoutService} from "../../../core/services/layout.service";

@Component({
  selector: 'admin-templates',
  standalone: true,
  imports: [CommonModule, UserNavbarComponent, TemplatesComponent],
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class GlobalTemplatesComponent implements OnInit {
  layoutSer = inject(LayoutService);

  ngOnInit() {
    this.layoutSer.withSubMenu.next(false)
  }

}
