import { Application } from 'express';
import { RestService } from './rest-service';
import { Client } from 'pg';

export class RestController {

  private app: Application;
  private restService: RestService;

  constructor(app: Application, databaseClient: Client) {
    this.app = app;
    this.restService = new RestService(databaseClient);
  }

  setupEndpoints() {
    this.setupSitesEndpoint();
    this.setupSingelSiteEndpoint();
  }

  private setupSitesEndpoint() {
    this.app.get( "/sites", ( req, res ) => {
      this.restService.getAllSites().then((sites) => {
        res.send( sites );
      });
    });
  }

  private setupSingelSiteEndpoint() {
    this.app.get( "/sites/:id", ( req, res ) => {
      const siteId = Number.parseInt(req.params.id, 10);
      const sinceParam = req.query.since;
      let latencyInterval;
      switch(sinceParam) {
        case '10minutes':
          latencyInterval = '10 minutes';
          break;
        case '24H':
          latencyInterval = '24 hours';
          break;
        case '1WEEK':
          latencyInterval = '7 days';
          break;
        default:
          latencyInterval = '2 minutes';
      }
      this.restService.getSingleSite(siteId, latencyInterval).then((site) => {
        res.send( site );
      });
    });
  }
}