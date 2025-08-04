import {Component, Input, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArabicNumbersPipe} from "../../../../../core/pipes/arabic-numbers.pipe";
import {Question} from "../../../../../core/interfaces/vote-report";
import {ColorsList} from "../../../../../core/functions/color-list";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {NgApexchartsModule} from "ng-apexcharts";
import {ResponsesComponent} from "../../../../../core/components/responses.component";

@Component({
  selector: 'single-answer',
  standalone: true,
  imports: [CommonModule, ArabicNumbersPipe, TranslateModule, NgApexchartsModule],
  templateUrl: './single-answer.component.html',
  styleUrls: ['./single-answer.component.scss']
})
export class SingleAnswerComponent implements OnChanges {
  @Input() question!: Question;

  @Input() anonymous = true;
  colors: string[] = ColorsList();
  showChart = false;
  chartOptions: any;

  constructor(private dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.question.voteFormQuestionChoices.map((choice) => {
      if (choice.questionChoicesResult.selectedCount > 0) {
        this.showChart = true;
      }
    });
    this.chartOptions = {
      series: this.question.voteFormQuestionChoices.map(question => {
        return question.questionChoicesResult.selectedCount
      }),
      colors: ColorsList(),
      dataLabels: {
        enabled: true,
        fontSize: '15px',

      },
      chart: {
        type: "donut",
        width: "300px"
      },
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          customScale: 1,
          donut: {
            size: '0',
            labels: {
              show: false,
              total: {
                show: false,
                showAlways: false,
                fontSize: '2rem',
                fontWeight: 600,
              },
            }
          },
        }
      }
    };
  }

  getResponses(id: number) {
    this.dialog.open(ResponsesComponent, {
      panelClass: 'vote-assignees-dialog',
      data: {
        id,
        voteFormId: +this.route.snapshot.params['id']
      }
    })
  }
}
