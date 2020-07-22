import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISite } from '../../../../interface/site';

@Component({
  selector: 'app-latency-graph',
  templateUrl: './latency-graph.component.html',
  styleUrls: ['./latency-graph.component.scss']
})
export class LatencyGraphComponent implements OnInit, OnDestroy {

  view: any[] = [700, 300];

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Latency (ms)';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  latencyData = [
    {
      "name": "Latency",
      "series": [
        {
          "name": this.toTimeOfDay(1595436544 - 10),
          "value": 150
        },
        {
          "name": this.toTimeOfDay(1595436544 - 5),
          "value": 50
        },
        {
          "name": this.toTimeOfDay(1595436544),
          "value": 100
        }
      ]
    }
  ];

  latencies = [
    { id: 2, capture_time: 1595436544 - 10, latency_ms: 100, http_status_code: 200 },
    { id: 3, capture_time: 1595436544 - 5, latency_ms: 150, http_status_code: 200 },
    { id: 4, capture_time: 1595436544, latency_ms: 50, http_status_code: 200 },
  ];

  webSocket: WebSocket;
  lastUpdate: string = this.toTimeOfDay(new Date().getTime() / 1000);

  constructor() {
  }

  ngOnInit() {
    // this.latencyData = [
    //   {
    //     name: 'Latency',
    //     series: this.latencies.map(l => {
    //       return {
    //         name: this.toTimeOfDay(l.capture_time),
    //         value:  l.latency_ms,
    //       };
    //     })
    //   }
    // ];

    this.webSocket = new WebSocket('ws://localhost/sites/1');
    this.webSocket.onopen = (() => {
      console.log('sock opened');
    });

    this.webSocket.onmessage = ((ev: MessageEvent) => {
      console.log('got event', ev);
      const dat: ISite = JSON.parse(ev.data);

      this.latencyData = [
        {
          name: 'Latency',
          series: dat.latencies.map(l => {
            return {
              name: this.toTimeOfDay(l.capture_time),
              value:  l.latency_ms,
            };
          })
        }
      ];

      this.lastUpdate = this.toTimeOfDay(new Date().getTime() / 1000);
    });
  }

  ngOnDestroy() {
    this.webSocket.close();
  }

  onSelect(data): void {

  }

  onActivate(data): void {

  }

  onDeactivate(data): void {

  }

  toTimeOfDay(stamp: number) {
      // Unixtimestamp
      var unixtimestamp = stamp;

      // Months array
      var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      // Convert timestamp to milliseconds
      var date = new Date(unixtimestamp * 1000);
      // var year = date.getFullYear();
      // var month = months_arr[date.getMonth()];
      // var day = date.getDate();
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();

      // Display date time in MM-dd-yyyy h:m:s format
      return /* month+'-'+day+'-'+year+' '+ */hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }
}
