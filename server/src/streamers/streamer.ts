import WebSocket from 'ws';
import { Client } from 'pg';
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

    this.websocketServer.on('connection', (ws: WebSocket, soc: WebSocket, req: IncomingMessage) => {
      ws.on('message', message => {
        console.log(`Received message => ${message}`)
        console.log(req);
      });

      setTimeout(() => {
        const siteInfo = DBQueries.getSingleSite(this.dbClient, 1);
        ws.send(JSON.stringify(siteInfo));
      }, 5000);
    })
  }
}