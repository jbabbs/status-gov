import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISite } from 'statusgov-interface/site';
import { SinceType, SiteService } from '../services/site.service';
import * as moment from 'moment';

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
  mostRecentLatency: number;

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

  toTimeOfDayLong(stamp) {
    return moment(stamp).format('e LTS');
  }

  toTimeOfDayShort(stamp) {
    return moment(stamp).format('LTS');
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
    const format = (time) => {
      return this.span === '10minutes' ? this.toTimeOfDayShort(time) : this.toTimeOfDayLong(time);
    };
    this.latencyData = [
      {
        name: 'Latency',
        series: site.latencies.map(l => {
          return {
            name: format(l.capture_time),
            value:  l.latency_ms,
          };
        })
      }
    ];
    const len = site.latencies.length;
    this.mostRecentLatency = site.latencies[len - 1].latency_ms;
    this.lastUpdate = this.toTimeOfDayShort(moment());
  }

  updateSiteData() {
    this.siteService.getSiteById(this.selectedSiteId, this.span).subscribe((site: ISite) => {
      this.setLatencyDataForSite(site);
    });
  }

  status() {
    if (!this.mostRecentLatency) {
      return '';
    }
    if (this.mostRecentLatency < 300) {
      return 'Good';
    } else if (this.mostRecentLatency < 600) {
      return 'OK';
    } else {
      return 'Bad';
    }
  }
}
