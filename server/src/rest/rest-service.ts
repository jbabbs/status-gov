
import * as DatabaseQueries from '../database/database-queries';
import { Client } from 'pg';

export class RestService {

  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async getAllSites() {
    const sites = await DatabaseQueries.getAllSites(this.client);
    return sites;
  }

  async getSingleSite(id: number, latencyInterval?: string) {
    const site = await DatabaseQueries.getSingleSite(this.client, id, latencyInterval);
    return site;
  }
}