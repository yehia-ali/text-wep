import { CommonModule } from "@angular/common";
import { Component, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ApexStroke, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent
} from "ng-apexcharts";
import { ArabicNumbersPipe } from "src/app/core/pipes/arabic-numbers.pipe";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: "chart-radial-bar",
  standalone:true,
  imports: [NgApexchartsModule, TranslateModule, ArabicNumbersPipe , CommonModule],
  encapsulation:ViewEncapsulation.None,
  templateUrl: "./chart-radial-bar.component.html",
  styleUrls: ["./chart-radial-bar.component.scss"]
})
export class ChartRadialBarComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> |any;
  values:any;
  @Input() label: string = " ";
  @Input() details: any;
  @Input() full:boolean = false;
  @Input() fillType: any = "solid";
  @Input() percentWeight: any = 700
  @Input() percentSize: any = '25px'
  @Input() percentOffset: any = -20
  @Input() percentColor: any
  @Input() small = false
  @Input() labelFontSize = '15px'
  @Input() labelColor = "#999"
  @Input() labelWeight = 600
  @Input() labelOffset = -10
  @Input() labelValueColor = true
  chartStart = -90
  chartEnd = 90
  valueColor: string | undefined;
  @Input() hideDetails = false;

  constructor(private translate : TranslateService , private arabicNumbers : ArabicNumbersPipe) {
  }
  ngOnInit(){
    this.values = this.details.achieved || 0

    if(this.full){
      this.chartStart = -135
      this.chartEnd = 225
    }

    if(this.fillType != 'gradient'){
      if(this.values < 35){
        this.valueColor = "#ea5455"
      }else if(this.values < 70){
        this.valueColor = "#f69e42"
      }else{
        this.valueColor = "#29cc99"
      }
    }else{
      this.valueColor = "#7B58CA"
    }
    if(this.labelValueColor){
      this.percentColor = this.valueColor
    }
    this.chartOptions = {
      series: [this.values],
      chart: {
        type: "radialBar",
        offsetY: 0,
      },

      stroke: {
        lineCap: "round", // حواف دائرية
      },

      plotOptions: {
        radialBar: {
          startAngle: this.chartStart,
          endAngle: this.chartEnd,
          track: {
            background: "#f0f0f0",
            strokeWidth: "97%",
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 1,
              left: 0,
              opacity: 0.21,
              blur: 2,
            },
          },
          dataLabels: {
            name: {
              fontSize: this.labelFontSize,
              color: this.labelColor,
              fontWeight: this.labelWeight,
              offsetY: this.labelOffset,
              fontFamily: "Tajawal",
            },
            value: {
              offsetY: this.percentOffset,
              fontSize: this.percentSize,
              fontWeight: this.percentWeight,
              fontFamily: "Tajawal",
              color: this.percentColor,
            },
          },
        },
      },

      fill: {
        colors: [this.valueColor],
        type: this.fillType,
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#65C7C3"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      labels: [this.translate.instant(this.label)],
    };

  }
}
