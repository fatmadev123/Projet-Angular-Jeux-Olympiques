import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { Observable, map, filter } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from 'ng-apexcharts';
import { Olympics } from '../core/models/Olympic';
import { OlympicService } from '../core/services/olympic.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public olympicsdetailcountry$!: Observable<Olympics[]> | any;
  public olympii!: Olympics[];
  public olympi!: Observable<Olympics[]> | any;
  olympics$!: Observable<ChartOptions>;
  olympicsMedalsCount$!: Observable<number>;
  olympicsAthletesCount$!: Observable<number>;
  olympicsentriesCount$!: Observable<number>;
  @ViewChild('chart') chart!: ChartComponent;
  country!: string;
  constructor(
    private route: ActivatedRoute,
    private olympicsService: OlympicService,
    private olympicService: OlympicService
  ) {
    var index!: number;
    index = 0;
    this.olympicsdetailcountry$ = this.olympicService.getOlympics();

    this.route.queryParams.subscribe((params) => {
      this.country = params['country'];
      console.log('Query param country : ', this.country);
    });

    this.olympi = this.olympicService
      .getOlympics()
      .pipe(
        filter((olympics) => olympics),

        map((olympics: Olympics[]) => {
          for (let elementCountry of olympics) {
            console.log(
              'elementCountry.country : ' + elementCountry.country.trim()
            );
            console.log('this.country : ' + this.country.trim());

            if (elementCountry.country.trim() !== this.country.trim()) {
              index = index + 1;
              console.log('index dans le boucle : ' + index);
            } else {
              break;
            }
          }
        })
      )
      .subscribe();

    console.log('index final : ' + index);

    this.olympics$ = this.olympicService.getOlympics().pipe(
      filter((olympics) => olympics),

      map((olympics: Olympics[]) => olympics[index]),
      map((olympic: Olympics) => {
        return {
          series: [
            {
              name: olympic.country,

              data: olympic.participations.map(
                (participation) => participation.medalsCount
              ),
            },
          ],
          chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'straight',
          },
          title: {
            text: 'Product Trends by Month',
            align: 'left',
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: olympic.participations.map(
              (participation) => participation.year
            ),
          },
        };
      })
    );
    this.olympicsMedalsCount$ = this.olympicService.getOlympics().pipe(
      filter((olympics) => olympics),
      map((olympics: Olympics[]) => olympics[index]),
      map((olympics: Olympics) => {
        return olympics.participations.reduce(
          (medalsCount, participation2) =>
            medalsCount + participation2.medalsCount,
          0
        );
      })
    );
    this.olympicsAthletesCount$ = this.olympicService.getOlympics().pipe(
      filter((olympics) => olympics),
      map((olympics: Olympics[]) => olympics[index]),
      map((olympics: Olympics) => {
        return olympics.participations.reduce(
          (athleteCount, participation2) =>
            athleteCount + participation2.athleteCount,
          0
        );
      })
    );
    this.olympicsentriesCount$ = this.olympicService.getOlympics().pipe(
      filter((olympics) => olympics),
      map((olympics: Olympics[]) => olympics[index].participations.length)
    );
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.country = params['country'];
      console.log('Query param country : ', this.country);
    });
  }
}
