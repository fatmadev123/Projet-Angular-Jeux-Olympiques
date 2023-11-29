import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable, filter, map, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartComponent } from 'ng-apexcharts';
import { Olympics } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { Router } from '@angular/router';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any>;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Observable<ChartOptions>;
  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
    this.chartOptions = this.olympics$.pipe(
      filter((olympics) => olympics),
      map((olympics: Olympics[]): ChartOptions => {
        const newchartOptions: ChartOptions = {
          series: [],
          chart: {
            width: 380,
            type: 'pie',
            events: {
              dataPointSelection: function (
                event,
                chartContext,
                config
              ): string {
                console.log('evenement' + event);
                console.log('chartContext' + chartContext);
                console.log('config' + config.dataPointIndex);
                console.log(config.w.config.series[config.dataPointIndex]);
                console.log(config.w.config.labels[config.dataPointIndex]);
                var country = config.w.config.labels[config.dataPointIndex];
                console.log(country);
                router.navigate(['/detail'], { queryParams: { country } });
                return country;
              },
            },
          },
          labels: [],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };
        for (let elementParticipant of olympics) {
          newchartOptions.series?.push(
            elementParticipant.participations
              .map((participation: Participation) => participation.medalsCount)
              .reduce((previous, current) => previous + current)
          );
          newchartOptions.labels.push(elementParticipant.country);
        }
        return newchartOptions;
      })
    );
  }
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }
}
