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
  }

  private setupSitesEndpoint() {
    this.app.get( "/sites", ( req, res ) => {
      this.restService.getAllSites().then((sites) => {
        res.send( sites );
      });
    });
  }
}