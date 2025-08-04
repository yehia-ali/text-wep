import {Component, inject, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit {
  @Input() workingHours: any;
  @Input() dashboard = true;
  userSer = inject(UserService);
  constructor() {
  }

  ngOnInit(): void {
  }

}
