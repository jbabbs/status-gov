import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISite } from '../../../../interface/site';
import { SinceType, SiteService } from '../services/site.service';

@Component({
  selector: 'app-latency-graph',
  templateUrl: './latency-graph.component.html',
  styleUrls: ['./latency-graph.component.scss']
})
export class LatencyGraphComponent implements OnInit, OnDestroy {

  sites: Array<any>;
  selectedSiteId: number|string;
  span: SinceType = '10minutes';

  latencyData;
  webSocket: WebSocket;
  lastUpdate = '';

  constructor(private siteService: SiteService) {
  }

  ngOnInit() {
    this.siteService.getAllSites().subscribe(sites => {
      this.sites = sites;
      this.selectedSiteId = this.sites[0].id;
      this.openSocket();
    });
  }

  ngOnDestroy() {
    this.closeSocket();
  }

  openSocket() {
    this.webSocket = new WebSocket('ws://localhost:9898/sites/' + this.selectedSiteId + 'since=' + this.span);

    this.webSocket.onmessage = ((ev: MessageEvent) => {
      const site: ISite = JSON.parse(ev.data);
      this.setLatencyDataForSite(site);
    });
  }

  closeSocket() {
    if (this.webSocket) {
      this.webSocket.close();
    }
    this.webSocket = null;
  }

  toTimeOfDay(stamp: number) {
      // Unixtimestamp
      var unixtimestamp = stamp;

      // Months array
      var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      // Convert timestamp to milliseconds
      var date = new Date(stamp);
      // var year = date.getFullYear();
      // var month = months_arr[date.getMonth()];
      // var day = date.getDate();
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();

      // Display date time in MM-dd-yyyy h:m:s format
      return /* month+'-'+day+'-'+year+' '+ */hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  onRealTimeClick() {
    this.span = '10minutes';
    this.openSocket();
  }

  on24Click() {
    this.closeSocket();
    this.span = '24H';
    this.updateSiteData();
  }

  onWeekClick() {
    this.closeSocket();
    this.span = '1WEEK';
    this.updateSiteData();
  }

  onSiteChange($event) {
    this.closeSocket();
    this.span = '10minutes';
    this.updateSiteData();
  }

  setLatencyDataForSite(site: ISite) {
    this.latencyData = [
      {
        name: 'Latency',
        series: site.latencies.map(l => {
          return {
            name: this.toTimeOfDay(l.capture_time),
            value:  l.latency_ms,
          };
        })
      }
    ];
    this.lastUpdate = this.toTimeOfDay(new Date().getTime() / 1000);
  }

  updateSiteData() {
    this.siteService.getSiteById(this.selectedSiteId, this.span).subscribe((site: ISite) => {
      this.setLatencyDataForSite(site);
    });
  }
}
