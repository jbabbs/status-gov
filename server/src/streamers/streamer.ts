import WebSocket from 'ws';
import { Client } from 'pg';
import url from 'url';
import { IncomingMessage } from 'http';
import * as DBQueries from '../database/database-queries';
import { sinceParamToInterval } from '../utils/utility';
export class Streamer {

  private websocketServer: WebSocket.Server;

  constructor(
    private dbClient: Client
  ) {

  }
  initialize() {
    this.websocketServer = new WebSocket.Server({ port: 9898 })

    this.websocketServer.on('connection', (ws: WebSocket, req: IncomingMessage) => {

      const urlWithStringQuery = url.parse(req.url);

      const dbClientId = Number.parseInt(urlWithStringQuery.pathname.split('/')[2], 10);
      let latencyInterval = '2 minutes';

      if (urlWithStringQuery.query) {
        const queryParams = urlWithStringQuery.query.split('=');
        const latencyIntervalIndex = queryParams.findIndex(str => str === 'since') + 1;
        const sinceParam = queryParams[latencyIntervalIndex];
        latencyInterval = sinceParamToInterval(sinceParam)
      }

      DBQueries.getSingleSite(this.dbClient, dbClientId, latencyInterval).then((site) => {
        ws.send(JSON.stringify(site));
      });

      setInterval(() => {
        DBQueries.getSingleSite(this.dbClient, dbClientId, latencyInterval).then((site) => {
          ws.send(JSON.stringify(site));
        });
      }, 5000);
    })
  }
}