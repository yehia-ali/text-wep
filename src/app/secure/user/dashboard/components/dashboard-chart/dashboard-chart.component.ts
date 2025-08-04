import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements OnInit {
  @Input() chartTitle!: string;
  constructor() { }

  ngOnInit(): void {
  }

}
