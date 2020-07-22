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
      this.restService.getSingleSite(siteId).then((site) => {
        res.send( site );
      });
    });
  }
}