import { Application } from 'express';
import { RestService } from './rest-service';
import { Client } from 'pg';
import { sinceParamToInterval } from '../utils/utility';
import bodyParser from 'body-parser';
import { ISite } from 'statusgov-interface/site';

export class RestController {

  private app: Application;
  private restService: RestService;

  constructor(app: Application, databaseClient: Client) {
    this.app = app;
    this.restService = new RestService(databaseClient);
    this.app.use(bodyParser.json())
  }

  setupEndpoints() {
    this.setupSitesEndpoint();
    this.setupSingelSiteEndpoint();
    this.setupCreateSiteEndpoint();
  }

  private setupSitesEndpoint() {
    this.app.get( '/sites', ( req, res ) => {
      this.restService.getAllSites().then((sites: ISite[]) => {
        res.send( sites );
      });
    });
  }

  private setupSingelSiteEndpoint() {
    this.app.get( '/sites/:id', ( req, res ) => {
      const siteId = Number.parseInt(req.params.id, 10);
      const sinceParam = req.query.since;
      const latencyInterval = sinceParamToInterval(sinceParam as string)
      this.restService.getSingleSite(siteId, latencyInterval).then((site: ISite) => {
        res.send( site );
      });
    });
  }

  private setupCreateSiteEndpoint() {
    this.app.post('/sites', (req, res, next) => {
      console.log(req.body);
      const site: ISite = req.body;
      if (!site.name || ! site.url) {
        next('Invalid form body');
      } else {
        this.restService.insertNewSite(site);
        res.send();
      }
    })
  }
}