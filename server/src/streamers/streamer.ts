import WebSocket from 'ws';
import { Client } from 'pg';
import url from 'url';
import { IncomingMessage } from 'http';
import * as DBQueries from '../database/database-queries';

export class Streamer {

  private websocketServer: WebSocket.Server;

  constructor(
    private dbClient: Client
  ) {

  }
  initialize() {
    this.websocketServer = new WebSocket.Server({ port: 9898 })

    this.websocketServer.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      ws.on('message', message => {
        console.log(`Received message => ${message}`)
        console.log(req);
      });

      const urlWithStringQuery = url.parse(req.url);

      const dbClientId = Number.parseInt(urlWithStringQuery.pathname.split('/')[2], 10);
      let latencyInterval = '2 minutes';

      if (urlWithStringQuery.query) {
        const queryParams = urlWithStringQuery.query.split('=');
        const latencyIntervalIndex = queryParams.findIndex(str => str === 'since') + 1
        const sinceParam = queryParams[latencyIntervalIndex];

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