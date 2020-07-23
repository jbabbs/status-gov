import express from 'express';
import { StatusDatabase } from './database/status-database';
import { RestController } from './rest/rest-controller';
import { Pinger } from './streamers/pinger';
import { Streamer } from './streamers/streamer';

// Setup databse related variables - Can be passed in if containerzied
process.env.DATABASE = process.env.DATABASE ? process.env.DATABASE : "localhost:5432";
process.env.DATABASE_NAME = process.env.DATABASE_NAME ? process.env.DATABASE_NAME : "test_db";

const app = express();
const port = 3000; // default port to listen

async function initializeApplication() {
    // Initialize database
    const statusDatabase = new StatusDatabase();
    await statusDatabase.startDatabase();

    // Initialize endpoints
    const restController = new RestController(app, statusDatabase.getClient());
    restController.setupEndpoints();

    const streamer = new Streamer(statusDatabase.getClient());
    streamer.initialize();

    const continuousPinger = new Pinger(statusDatabase.getClient());
    continuousPinger.startPinging();

    // start the Express server
    app.listen( port, () => {
        console.log( `server started at http://localhost:${ port }` );
    } );
}

initializeApplication();
