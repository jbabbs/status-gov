import WebSocket from 'ws';
import { Client } from 'pg';
import { IncomingMessage } from 'http';

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

    })
  }
}