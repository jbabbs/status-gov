import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ISite } from 'statusgov-interface/site';
import { SinceType, SiteService } from '../services/site.service';
import * as moment from 'moment';

@Component({
  selector: 'app-latency-graph',
  templateUrl: './latency-graph.component.html',
  styleUrls: ['./latency-graph.component.scss']
})
export class LatencyGraphComponent implements OnInit, OnDestroy {

  @Input()
  sites: Array<ISite>;
  selectedSiteId: number|string;
  span: SinceType = '10minutes';
  latencyData;
  webSocket: WebSocket;
  lastUpdate = '';
  mostRecentLatency: number;

  selectedSite: ISite;
  siteStatus: 'GOOD' | 'OK' | 'NOT OK' | 'UNKNOWN';

  constructor(private siteService: SiteService) {
  }

  ngOnInit() {
    if (!this.sites || !this.sites.length) {
      return;
    }

    this.selectedSiteId = this.sites[0].id;
    this.selectedSite = this.sites[0];
    this.openSocket();
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
    return moment(stamp).format('ddd LTS');
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

  onSiteChange(siteId: number) {
    this.closeSocket();
    this.span = '10minutes';
    this.selectedSite = this.sites.find(site => site.id === this.selectedSiteId);
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
    this.updateStatus();
  }

  updateSiteData() {
    this.siteService.getSiteById(this.selectedSiteId, this.span).subscribe((site: ISite) => {
      this.setLatencyDataForSite(site);
    });
  }

  updateStatus() {
    if (!this.mostRecentLatency) {
      this.siteStatus = 'UNKNOWN';
    }
    if (this.mostRecentLatency === 0) {
      this.siteStatus = 'NOT OK';
    } else if (this.mostRecentLatency < 300) {
      this.siteStatus = 'GOOD';
    } else if (this.mostRecentLatency < 1000) {
      this.siteStatus = 'OK';
    } else {
      this.siteStatus = 'NOT OK';
    }
  }
}
