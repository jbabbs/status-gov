
import * as DatabaseQueries from '../database/database-queries';
import { Client } from 'pg';
import { ISite } from 'statusgov-interface/site';

export class RestService {

  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async getAllSites(): Promise<ISite[]> {
    const sites = await DatabaseQueries.getAllSites(this.client);
    return sites;
  }

  async getSingleSite(id: number, latencyInterval?: string): Promise<ISite> {
    const site = await DatabaseQueries.getSingleSite(this.client, id, latencyInterval);
    return site;
  }

  insertNewSite(site: ISite) {
    DatabaseQueries.insertNewSite(this.client, site);
  }
}