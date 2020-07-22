import { Client } from "pg";
import request from 'request';
import * as DBQueries from '../database/database-queries';

 // Continuously pings relevant apis
 export class Pinger {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async startPinging() {
    this.pingAllUrls();
    setInterval(() => {
      this.pingAllUrls();
    }, 5000)
  }

  // Get all sites from sites table, ping each url, then
  // store latency information into latency table
  private async pingAllUrls() {
    const sites = await this.getAllSites();

    if (sites.length === 0) {
      return;
    }

    const requestMap = new Map<number, {responseTime: number, statusCode: number}>();
    const promises: Promise<request.Request>[] = [];

    sites.forEach(site => {
      promises.push(new Promise((resolve, reject) => {
        request.get({url: site.url, time: true}, (error: any, response: any) => {
          if (error) {
            requestMap.set(site.id, {responseTime: 0, statusCode: response.statusCode});
          } else {
            requestMap.set(site.id, {responseTime: response.elapsedTime, statusCode: response.statusCode});
          }

          console.log(`${site.name}: ${requestMap.get(site.id)}`);
          resolve();
        });
      }))
    });

    await Promise.all(promises);
    DBQueries.insertNewLatencyInfo(this.client, requestMap);
  }

  private async getAllSites() {
    const allSites = await DBQueries.getAllSites(this.client);
    return allSites;
  }
 }