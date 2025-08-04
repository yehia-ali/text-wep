import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";

@Component({
  selector: 'doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
  providers: [ArabicNumbersPipe]
})
export class DoughnutChartComponent {
  public chartOptions: any;
  arr: any = [];
  loading = true;

  constructor(private translate: TranslateService, private ArabicNumber: ArabicNumbersPipe) {
    this.triggerChart()
  }

  triggerChart() {
    this.chartOptions = {
      series: this.arr,
      colors: ['#7b58ca', '#F69E42', '#29CC99'],
      dataLabels: {
        enabled: true,
        fontSize: '15px',
        formatter: (val: any) => {
          return this.ArabicNumber.transform(val.toFixed()) + "%";
        },
      },
      chart: {
        type: "donut",
        width: "100%",
        style: {
          maxWidth: '350px',
        }
      },
      labels: [this.translate.instant('new'), this.translate.instant('in_progress'), this.translate.instant('completed')],
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          customScale: 1,
          donut: {
            size: '75%',
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: this.translate.instant('total'),
                fontSize: '2rem',
                fontWeight: 600,
                formatter: (val: any) => {
                  let total = val.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b;
                  }, 0);
                  return this.ArabicNumber.transform(total) + ' ' + this.translate.instant('task');
                }
              },
            }
          },
        }
      }
    };
    setTimeout(() => {
      this.loading = false
    }, 500);
  }
}
