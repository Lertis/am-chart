import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { timer, interval, of } from 'rxjs';
import { take, switchMap, map, tap } from 'rxjs/operators';

interface CharData {
  date: string | Date | any;
  value: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('chartdiv', am4charts.XYChart);

      chart.paddingRight = 20;
      const finalArr: CharData[] = [];

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'value';

      series.tooltipText = '{valueY.value}';
      chart.cursor = new am4charts.XYCursor();

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      interval(100)
        .pipe(
/*           take(100), */
          switchMap(() => {
            const newObj: CharData = {
              date: new Date(),
              value: Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10)
            };
            finalArr.push(newObj)
            return of(finalArr);
          }),
          tap((array: CharData[]) => {
            chart.data = array;
            this.chart = chart;
          })
        ).subscribe();
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
